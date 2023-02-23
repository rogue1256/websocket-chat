import * as http from "http";
import { IBinaryMessage, IUtf8Message, Message, server as WebSocketServer } from "websocket";
import { nanoid } from "nanoid";
import { TypedEmitter } from "tiny-typed-emitter";
import { WebsocketEvents } from "../httpServer/webSocketEvents";
import { WebsocketClientInfo } from "./clientInfo";
import { SECONDS_TO_MILLISECONDS_RATIO } from "../helpers";
import { createDefaultLogger } from "../logging";
import { LoginProvider } from "../loginStorage";
import { mapFromTransportLayer, mapToTransportLayer, stringifyTransportModel } from "./transportLayerMapper";
import * as businessModels from "./models/business";

const chatLogger = createDefaultLogger("WebsocketChatServer");

export class WebsocketChatServer {
  private readonly HEARTBEAT_INTERVAL_IN_SECONDS = 60;
  private readonly HEARTBEAT_INTERVAL_MILLISECONDS = this.HEARTBEAT_INTERVAL_IN_SECONDS * SECONDS_TO_MILLISECONDS_RATIO;
  private readonly HEARTBEAT_CHECK_DELAY_IN_MILLISECONDS = 1000;

  wsServer: WebSocketServer;
  activeClients: Map<string, WebsocketClientInfo> = new Map<string, WebsocketClientInfo>();

  private readonly eventMediator: TypedEmitter<WebsocketEvents> = new TypedEmitter<WebsocketEvents>();

  heartBeatTimer?: NodeJS.Timer;

  constructor(httpServer: http.Server, private readonly loginProvider: LoginProvider) {
    chatLogger.debug("Setting up WebSocket server", httpServer);
    this.wsServer = new WebSocketServer({
      httpServer: httpServer,
      autoAcceptConnections: false,
    });
    chatLogger.debug("WsServer created", this.wsServer);

    this.setupWsCallbacks();

    this.registerEventsCallbacks();
  }

  public startHeartbeat(): void {
    this.heartBeatTimer = setInterval(() => this.heartbeatAction(), this.HEARTBEAT_INTERVAL_MILLISECONDS);
  }

  public stopHeartbeat(): void {
    clearInterval(this.heartBeatTimer);
  }

  private registerEventsCallbacks(): void {
    chatLogger.debug("Assigning events callbacks");

    this.eventMediator.on("connectionClosed", (connectionId) => this.handleConnectionClosedEvent(connectionId));

    this.eventMediator.on("closeDanglingConnection", (clientId) => this.handleCloseDanglingConnection(clientId));
  }

  private handleCloseDanglingConnection(clientId: string): void {
    chatLogger.verbose(`Attempting to close dangling connection for ${clientId}`);
    const client = this.activeClients.get(clientId);
    if (!client) {
      chatLogger.warn(`Could not find active clients with id ${clientId} while closing dangling connection`);
      return;
    }

    client.wsConnection.close();
    chatLogger.verbose(`Removing client with id ${clientId} from store`);
    this.activeClients.delete(clientId);
  }

  private handleConnectionClosedEvent(id: string): void {
    const client = this.activeClients.get(id);
    if (!client) {
      chatLogger.warn(`Could not find a client with id ${id} in active client connections`);
      return;
    }

    this.activeClients.delete(id);
  }

  private handleInvalidJson(connectionId: string, description?: string): void {
    const client = this.activeClients.get(connectionId);

    if (client) {
      this.sendPrivateMessage(client, new businessModels.outgoingModels.ErrorMessage("invalidJson", description));
    }
  }

  private handlePongMessage(connectionId: string): void {
    chatLogger.debug(`Received pong from ${connectionId}`);
    const clientInfo = this.activeClients.get(connectionId);
    if (!clientInfo) {
      chatLogger.warn(`Could not find client info for pong from ${connectionId}`);
      return;
    }

    clientInfo.pongReceived();
    if (clientInfo.isLoggedIn && clientInfo.username) {
      this.loginProvider.loginAccessed(clientInfo.username);
    }
  }

  private handlePingMessage(connectionId: string): void {
    chatLogger.debug(`Received ping from ${connectionId}`);
    const clientInfo = this.activeClients.get(connectionId);
    if (!clientInfo) {
      chatLogger.warn(`Could not find client info for ping from ${connectionId}`);
      return;
    }

    clientInfo.pinReceived();
    if (clientInfo.isLoggedIn && clientInfo.username) {
      this.loginProvider.loginAccessed(clientInfo.username);
    }
  }

  private handleMessageWithoutLogin(connectionId: string): void {
    const clientInfo = this.activeClients.get(connectionId);
    if (!clientInfo) {
      return;
    }

    this.sendPrivateMessage(clientInfo, new businessModels.outgoingModels.ErrorMessage("messagingWhileNotLoggedIn"));
  }

  private handleNewLogin(client: WebsocketClientInfo, username: string, location: string): void {
    const secret = nanoid();
    const login = this.loginProvider.addLogin(username, secret);
    const broadcast = new businessModels.outgoingModels.LoginBroadcast(username, location);
    this.broadcastMessage(broadcast);

    const userLogin = new businessModels.outgoingModels.LoginMessage(username, location, secret);
    this.sendPrivateMessage(client, userLogin);

    client.login(username, login.id);
  }

  private handleLoginMessage(
    loginMessage: businessModels.incomingModels.LoginMessage,
    connectionId: string,
    location: string
  ): void {
    chatLogger.info(`Received login message`, { loginMessage, location });
    const clientInfo = this.activeClients.get(connectionId);
    if (!clientInfo) {
      chatLogger.warn(`Could not find client info with connectionId ${connectionId}`);
      return;
    }

    const { username, secret } = loginMessage;
    const login = this.loginProvider.findLogin(loginMessage.username);
    if (!login) {
      return this.handleNewLogin(clientInfo, username, location);
    } else if (secret) {
      const secretBelongsToUsername = this.loginProvider.secretBelongsToUsername(username, secret);
      if (secretBelongsToUsername) {
        if (clientInfo.isLoggedIn) {
          const alreadyLoggedInError = new businessModels.outgoingModels.ErrorMessage("alreadyLoggedIn");
          this.sendPrivateMessage(clientInfo, alreadyLoggedInError);
          return;
        }

        const loginBroadcast = new businessModels.outgoingModels.LoginBroadcast(login.username, location);
        this.broadcastMessage(loginBroadcast);

        const userLogin = new businessModels.outgoingModels.LoginMessage(username, location, secret);
        this.sendPrivateMessage(clientInfo, userLogin);

        clientInfo.login(username, login.id);
        return;
      }

      this.sendPrivateMessage(clientInfo, new businessModels.outgoingModels.ErrorMessage("loginTaken"));
      return;
    }

    this.sendPrivateMessage(clientInfo, new businessModels.outgoingModels.ErrorMessage("loginTaken"));
  }

  private handleTextFromUserMessage(
    userMessage: businessModels.incomingModels.TextMessage,
    connectionId: string
  ): void {
    const clientInfo = this.activeClients.get(connectionId);
    if (!clientInfo) {
      return;
    }

    if (!clientInfo.isLoggedIn || !clientInfo.username) {
      this.handleMessageWithoutLogin(connectionId);
      return;
    }

    this.broadcastMessage(new businessModels.outgoingModels.TextBroadcast(clientInfo.username, userMessage.text));
  }

  private handleUtf8Messages(msg: IUtf8Message, connectionId: string, location: string): void {
    const incomingMessage = mapFromTransportLayer(msg.utf8Data);
    if (incomingMessage.type === "malformedMessage") {
      this.handleInvalidJson(connectionId);
      return;
    }

    if (incomingMessage.type === "login") {
      this.handleLoginMessage(incomingMessage, connectionId, location);
      return;
    }

    this.handleTextFromUserMessage(incomingMessage, connectionId);
  }

  private handleBinaryMessages(_msg: IBinaryMessage, connectionId: string): void {
    const client = this.activeClients.get(connectionId);

    if (client) {
      const err = new businessModels.outgoingModels.ErrorMessage("bytesReceived");
      this.sendPrivateMessage(client, err);
    }
  }

  private handleMessage(msg: Message, connectionId: string, location: string): void {
    if (msg.type === "utf8") {
      this.handleUtf8Messages(msg, connectionId, location);
    } else {
      this.handleBinaryMessages(msg, connectionId);
    }
  }

  private setupWsCallbacks(): void {
    chatLogger.debug("Assigning callbacks");
    this.wsServer.on("request", (request) => {
      const location = request.socket.remoteAddress;
      const connection = request.accept();
      const connectionId = nanoid();
      this.activeClients.set(connectionId, new WebsocketClientInfo(connection));
      connection.on("message", (msg) => this.handleMessage(msg, connectionId, location ?? "unknown"));
      connection.on("close", () => this.handleConnectionClosedEvent(connectionId));
      connection.on("pong", () => this.handlePongMessage(connectionId));
      connection.on("ping", () => this.handlePingMessage(connectionId));
    });
  }

  private heartbeatAction(): void {
    for (const [, activeClient] of this.activeClients.entries()) {
      activeClient.pingClient(nanoid());
    }

    setTimeout(() => this.validateActiveClients(), this.HEARTBEAT_CHECK_DELAY_IN_MILLISECONDS);
  }

  private validateActiveClients(): void {
    const clientIdsToDelete: string[] = [];
    for (const [key, activeClient] of this.activeClients.entries()) {
      if (!activeClient.clientAlive) {
        clientIdsToDelete.push(key);
      }
    }

    for (const clientId of clientIdsToDelete) {
      this.eventMediator.emit("closeDanglingConnection", clientId);
    }
  }

  private broadcastMessage(msg: businessModels.OutgoingMessage): void {
    this.wsServer.broadcastUTF(stringifyTransportModel(mapToTransportLayer(msg)));
  }

  private sendPrivateMessage(client: WebsocketClientInfo, msg: businessModels.OutgoingMessage): void {
    client.wsConnection.sendUTF(stringifyTransportModel(mapToTransportLayer(msg)));
  }
}
