import { IncomingMessage } from "./incomingMessage";

export class LoginMessage extends IncomingMessage {
  public readonly type = "login";
  constructor(id: string, public readonly username: string, public readonly secret?: string) {
    super(id);
  }
}
