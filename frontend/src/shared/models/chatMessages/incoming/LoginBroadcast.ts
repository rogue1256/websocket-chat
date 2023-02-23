import { IncomingMessage } from "./IncomingMessage";

export class LoginBroadcast extends IncomingMessage {
  public readonly type = "loginBroadcast";

  constructor(id: string, public readonly username: string, public readonly location: string) {
    super(id);
  }
}
