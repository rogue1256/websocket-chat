import { MINUTES_TO_SECONDS_RATIO, SECONDS_TO_MILLISECONDS_RATIO } from "../helpers";
import { connection } from "websocket";

interface CommonUser {
  isLoggedIn: boolean;
}

interface LoggedOutUser extends CommonUser {
  isLoggedIn: false;
}

interface LoggedInUser extends CommonUser {
  isLoggedIn: true;
  username: string;
  loginId: string;
}

type UserInfo = LoggedInUser | LoggedOutUser;

export class WebsocketClientInfo {
  private readonly MINUTES_TIMEOUT = 5;
  private readonly MAX_LAST_MESSAGE_TIMEOUT =
    this.MINUTES_TIMEOUT * MINUTES_TO_SECONDS_RATIO * SECONDS_TO_MILLISECONDS_RATIO;

  private lastMessageReceived?: Date;

  private userInfo: UserInfo = { isLoggedIn: false };

  constructor(public readonly wsConnection: connection) {}

  public pingClient(id: string): void {
    this.wsConnection.ping(id);
  }

  public pongReceived(): void {
    this.messageReceived();
  }

  public pinReceived(): void {
    this.messageReceived();
  }

  public messageReceived(): void {
    this.lastMessageReceived = new Date();
  }

  public get clientAlive(): boolean {
    return new Date().getTime() - (this.lastMessageReceived ?? new Date()).getTime() < this.MAX_LAST_MESSAGE_TIMEOUT;
  }

  public login(username: string, loginId: string): void {
    this.userInfo = { isLoggedIn: true, username: username, loginId };
    this.messageReceived();
  }

  public get isLoggedIn(): boolean {
    return this.userInfo.isLoggedIn;
  }

  public get username(): string | null {
    if (this.userInfo.isLoggedIn) {
      return this.userInfo.username;
    }

    return null;
  }

  public get loginId(): string | null {
    if (this.userInfo.isLoggedIn) {
      return this.userInfo.loginId;
    }

    return null;
  }
}
