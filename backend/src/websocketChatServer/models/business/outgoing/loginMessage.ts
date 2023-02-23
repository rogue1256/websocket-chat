import { OutgoingMessage } from "./outgoingMessage";

export class LoginMessage extends OutgoingMessage {
  public readonly type = "loginMessage";

  constructor(public readonly username: string, public readonly location: string, public readonly secret: string) {
    super();
  }
}
