import { OutgoingMessage } from "./OutgoingMessage";

export class LoginMessage extends OutgoingMessage {
  public readonly type = "login";

  constructor(public readonly username: string, public readonly secret?: string) {
    super();
  }
}
