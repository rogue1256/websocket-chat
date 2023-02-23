import { TypedEmitter } from "tiny-typed-emitter";
import { OperationWithoutSocketOpenError, StatusCode, safeMapNumberToStatusCode } from "./models";
import { WsStatus } from "./models";
import * as transportModels from "../../shared/models/transport";
import { isRight } from "fp-ts/Either";
import { PathReporter } from "io-ts/PathReporter";
import { ChatWebSocketError, TransportErrors } from "../../shared/models/errors";

// todo: make id mandatory for every emit
interface ChatWebsocketEvents {
  errorOccurred: (err: ChatWebSocketError, id: string) => void;

  messageReceived: (msg: transportModels.IncomingMessage, id: string) => void;

  onSocketStatusChanges: (wsStatus: WsStatus | null, id: string) => void;

  socketOpen: (id: string) => void;

  socketClosed: (statusCode: StatusCode, id: string, reason?: string) => void;
}

export class ChatWebsocket extends TypedEmitter<ChatWebsocketEvents> {
  private socketStatus: WsStatus | null = null;

  private socket: WebSocket | null = null;

  private connectionOpenTimer: NodeJS.Timer | null = null;

  private socketCleanupFn: (() => void) | null = null;

  constructor(public readonly id: string, public readonly serverAddress: URL) {
    super();
  }

  public openConnection(timeoutMs: number): void {
    try {
      const socket = new WebSocket(this.serverAddress);
      this.setStatus(WsStatus.CONNECTING);

      const onMessage = (evt: MessageEvent): void => this.onMessage(evt);
      const onOpen = (evt: Event): void => this.onSocketOpen(evt);
      const onError = (evt: Event): void => this.onSocketError(evt);
      const onClose = (evt: CloseEvent): void => this.onSocketClose(evt);

      socket.onmessage = onMessage;
      socket.onerror = onError;
      socket.onopen = onOpen;
      socket.onclose = onClose;

      this.socket = socket;

      this.socketCleanupFn = (): void => {
        this.clearTimer();
        socket.removeEventListener("message", onMessage);
        socket.removeEventListener("error", onError);
        socket.removeEventListener("open", onOpen);
        socket.removeEventListener("close", onClose);
        socket.onmessage = null;
        socket.onerror = null;
        socket.onopen = null;
        socket.onclose = null;
        this.socket = null;
        this.socketCleanupFn = null;
      };

      this.connectionOpenTimer = setTimeout(() => {
        if (this.socketCleanupFn) {
          this.socketCleanupFn();
        }
        socket.close(StatusCode.NoConnectionBeforeTimeout);

        const ev = new CloseEvent("socketClosedCustom", {
          code: StatusCode.NoConnectionBeforeTimeout,
          reason: "Closing the socket due to set timeout",
        });
        this.onSocketClose(ev);
      }, timeoutMs);
    } catch (e) {
      // todo: verify that this is the only possible error
      this.emit("errorOccurred", "wsUrlInvalid", this.id);
    }
  }

  public closeConnection(code?: StatusCode): void {
    if (!this.socket) {
      throw new OperationWithoutSocketOpenError();
    }

    this.setStatus(WsStatus.CLOSING);
    this.socket.close(code);
  }

  public sendMessage(msg: transportModels.OutgoingMessage): void {
    if (!this.socket) {
      throw new OperationWithoutSocketOpenError();
    }

    if (msg.type === "login") {
      this.sendLoginRequest(this.socket, msg);
      return;
    }

    if (msg.type === "textFromUser") {
      this.sendSocketMessage(this.socket, msg);
    }
  }

  private onSocketClose(event: CloseEvent): void {
    this.emit("socketClosed", safeMapNumberToStatusCode(event.code), this.id);
    if (this.socketCleanupFn) {
      this.socketCleanupFn();
    }

    this.setStatus(WsStatus.CLOSED);
  }

  private onSocketOpen(_: Event): void {
    this.setStatus(WsStatus.OPEN);
    this.clearTimer();

    this.emit("socketOpen", this.id);
  }

  private onSocketError(_: Event): void {
    // The socket might receive an error, but still be alive.
    // For better knowledge, I need to consult the specification.
    if (this.socket?.readyState === WsStatus.CLOSED && this.socketCleanupFn) {
      this.onSocketClose(
        new CloseEvent("socketClosedCustom", {
          code: StatusCode.WebsocketClosedAfterError,
          reason: "The socket returned an error and is already closed",
        })
      );
    }

    // todo: there might be other errors
    this.emit("errorOccurred", "unknownError", this.id);
  }

  private onMessageError(error: TransportErrors): void {
    this.emit("errorOccurred", error, this.id);
  }

  private onMessage(msg: MessageEvent): void {
    const msgJson = ChatWebsocket.parseJson(msg.data);
    if (!msgJson) {
      this.emit("errorOccurred", "invalidJson", this.id);
      return;
    }

    const parsedTransportModel = ChatWebsocket.parseUnknownToTransportModel(msgJson);
    if (parsedTransportModel.type === "errorMessage") {
      this.onMessageError(parsedTransportModel.error);
      return;
    }

    this.emit("messageReceived", parsedTransportModel, this.id);
  }

  private setStatus(status: WsStatus | null): void {
    this.socketStatus = status;
    this.emit("onSocketStatusChanges", status, this.id);
  }

  private static parseJson(json: any): unknown | null {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error("Invalid json");
      return null;
    }
  }

  private sendLoginRequest(socket: WebSocket, login: transportModels.outgoingModels.LoginMessage): void {
    if (!login.username.trim()) {
      // todo: emit error
      throw new Error("username should not be empty");
    }

    socket.send(JSON.stringify(login));
  }

  private sendSocketMessage(socket: WebSocket, msg: transportModels.outgoingModels.OutgoingMessage): void {
    socket.send(JSON.stringify(msg));
  }

  private clearTimer(): void {
    if (this.connectionOpenTimer) {
      clearTimeout(this.connectionOpenTimer);
      this.connectionOpenTimer = null;
    }
  }

  private static parseUnknownToTransportModel(data: unknown): transportModels.IncomingMessage {
    // todo: better error handling
    if (transportModels.incomingModels.isErrorMessage(data)) {
      const type = transportModels.incomingModels.ErrorMessageRuntime.decode(data);
      if (isRight(type)) {
        return type.right;
      }

      throw new Error(PathReporter.report(type).join("; "));
    }

    if (transportModels.incomingModels.isTextBroadcast(data)) {
      const type = transportModels.incomingModels.TextBroadcastRuntime.decode(data);
      if (isRight(type)) {
        return type.right;
      }

      throw new Error(PathReporter.report(type).join("; "));
    }

    if (transportModels.incomingModels.isLoginBroadcast(data)) {
      const type = transportModels.incomingModels.LoginBroadcastRuntime.decode(data);
      if (isRight(type)) {
        return type.right;
      }

      throw new Error(PathReporter.report(type).join("; "));
    }

    if (transportModels.incomingModels.isLoginMessage(data)) {
      const type = transportModels.incomingModels.LoginMessageRuntime.decode(data);
      if (isRight(type)) {
        return type.right;
      }

      throw new Error(PathReporter.report(type).join("; "));
    } else {
      // todo: better error handling
      console.error(data);
      throw new Error("Unknown JSON received");
    }
  }
}
