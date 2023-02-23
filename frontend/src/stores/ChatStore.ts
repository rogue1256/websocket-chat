import { ChatWebsocket, StatusCode, WsStatus } from "../communications/chatWebsocket";
import { action, computed, makeObservable, observable } from "mobx";
import { RootStore } from "./RootStore";
import { nanoid } from "nanoid";
import { Chat } from "./domain/Chat";
import { ChatError, LoginMessage, TextMessage } from "../shared/models/chat";
import * as transportModels from "../shared/models/transport";
import * as businessModels from "../shared/models/chatMessages";
import { mapFromTransportLayer, mapToTransportLayer } from "../shared/models/transportLayerMapper";
import { ChatWebSocketError } from "../shared/models/errors";

const DEFAULT_WEBSOCKET_TIMEOUT_MS = 20000;

export class ChatStore {
  public chat: Chat = new Chat();
  public socketStatus: WsStatus | null = null;
  public loginInProgress = observable.box(false);
  public lastChatError: ChatError | null = null;

  private socket: ChatWebsocket | null = null;

  constructor(private readonly rootStore: RootStore) {
    makeObservable<
      ChatStore,
      | "socket"
      | "setSocketStatus"
      | "handleWebsocketError"
      | "handleWebsocketClose"
      | "handleWebsocketMessageReceived"
      | "handleWebsocketOpened"
      | "handleWebsocketStatusChange"
    >(this, {
      chat: observable,
      socketStatus: observable,
      loginInProgress: observable,
      socket: observable,
      lastChatError: observable,
      initiateConnection: action,
      initiateChatLogin: action,
      sendTextMessage: action,
      disconnectChat: action,
      isChatLoggedIn: computed,
      isSocketConnecting: computed,
      isSocketOpen: computed,
      chatConnecting: computed,
      setSocketStatus: action,
      handleWebsocketError: action,
      handleWebsocketClose: action,
      handleWebsocketMessageReceived: action,
      handleWebsocketOpened: action,
      handleWebsocketStatusChange: action,
    });
  }

  public initiateConnection(): void {
    if (!this.chat.serverAddress || !this.chat.username) {
      // todo: proper error
      throw new Error("Missing server address or username");
    }
    this.lastChatError = null;

    const chatWs = new ChatWebsocket(nanoid(), this.chat.serverAddress);
    chatWs.on("messageReceived", (msg) => this.handleWebsocketMessageReceived(msg));
    chatWs.on("onSocketStatusChanges", (newStatus) => this.handleWebsocketStatusChange(newStatus));
    chatWs.on("errorOccurred", (err) => this.handleWebsocketError(err));
    chatWs.on("socketOpen", () => this.handleWebsocketOpened(true));
    chatWs.on("socketClosed", (code, _, reason) => this.handleWebsocketClose(code, reason));
    chatWs.openConnection(DEFAULT_WEBSOCKET_TIMEOUT_MS);
    this.socket = chatWs;
  }

  public initiateChatLogin(): void {
    if (!this.socket) {
      // todo: proper error
      throw new Error("Invalid operation on socket");
    }

    if (!this.chat.username) {
      // todo: proper error
      throw new Error("Cannot operate on an empty username");
    }

    this.loginInProgress.set(true);
    const loginRequest = new businessModels.outgoingModels.LoginMessage(
      this.chat.username,
      this.chat.secret ?? undefined
    );
    this.socket.sendMessage(mapToTransportLayer(loginRequest));
  }

  public sendTextMessage(): void {
    if (this.socket) {
      const msg = new businessModels.outgoingModels.TextMessage(this.chat.messageDraft);
      this.socket.sendMessage(mapToTransportLayer(msg));
    }
  }

  public disconnectChat(): void {
    this.socket?.closeConnection();
    this.socket?.removeAllListeners();
    this.rootStore.UiStore.setLoginScreenShown(true);
    this.chat.clearLoginMessages();
    this.chat.logout();
    this.lastChatError = null;
  }

  get isChatLoggedIn(): boolean {
    return this.chat.isLoggedIn;
  }

  get isSocketConnecting(): boolean {
    return this.socketStatus === WsStatus.CONNECTING;
  }

  get isSocketOpen(): boolean {
    return this.socketStatus === WsStatus.OPEN;
  }

  get chatConnecting(): boolean {
    return this.isSocketConnecting || this.loginInProgress.get();
  }

  private setSocketStatus(newStatus: WsStatus | null): void {
    this.socketStatus = newStatus;
  }

  private handleWebsocketError(err: ChatWebSocketError): void {
    this.loginInProgress.set(false);

    if (err === "loginTaken") {
      this.chat.clearSecret();
      this.lastChatError = "loginAlreadyExists";
    } else {
      throw new Error(`Could not handle websocket error ${err}`);
    }
  }

  private handleWebsocketClose(code: StatusCode, reason?: string): void {
    if (code === StatusCode.AbnormalClosure) {
      this.lastChatError = "abnormalDisconnect";
    }

    if (code === StatusCode.NoConnectionBeforeTimeout) {
      this.lastChatError = "websocketTimedOut";
    }

    if (code === StatusCode.WebsocketClosedAfterError) {
      // todo: probably invalid mapping
      this.lastChatError = "abnormalDisconnect";
    }

    this.socket = null;
  }

  private handleWebsocketMessageReceived(msg: transportModels.IncomingMessage): void {
    const mappedMsg = mapFromTransportLayer(msg);
    if (mappedMsg.type === "loginBroadcast") {
      this.chat.addMessage(new LoginMessage(mappedMsg.id, mappedMsg.username, mappedMsg.location));
    }

    if (mappedMsg.type === "loginMessage") {
      this.chat.login(mappedMsg.secret);
      this.rootStore.UiStore.setLoginScreenShown(false);
      this.loginInProgress.set(false);
    }

    if (mappedMsg.type === "textBroadcast") {
      this.chat.addMessage(
        new TextMessage(mappedMsg.id, mappedMsg.username === this.chat.username, mappedMsg.message, mappedMsg.username)
      );
    }
  }

  private handleWebsocketOpened(shouldLogin: boolean = false): void {
    if (shouldLogin) {
      this.initiateChatLogin();
    }
  }

  private handleWebsocketStatusChange(newStatus: WsStatus | null): void {
    this.setSocketStatus(newStatus);
  }
}
