import { OutgoingMessage } from "./outgoingMessage";

export class TextBroadcast extends OutgoingMessage {
  public readonly type = "textBroadcast";

  constructor(public readonly username: string, public readonly message: string) {
    super();
  }
}
