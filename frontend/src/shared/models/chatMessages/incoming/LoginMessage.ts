import { IncomingMessage } from "./IncomingMessage";

export class LoginMessage extends IncomingMessage {
  public readonly type = "loginMessage";

  constructor(
    id: string,
    public readonly username: string,
    public readonly location: string,
    public readonly secret: string
  ) {
    super(id);
  }
}
