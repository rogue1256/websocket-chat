import { OutgoingMessage } from "./outgoingMessage";

export class LoginBroadcast extends OutgoingMessage {
  public readonly type = "loginBroadcast";

  constructor(public readonly username: string, public readonly location: string) {
    super();
  }
}
