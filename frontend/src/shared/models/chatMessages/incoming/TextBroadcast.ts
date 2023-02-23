import { IncomingMessage } from "./IncomingMessage";

export class TextBroadcast extends IncomingMessage {
  public readonly type = "textBroadcast";

  constructor(id: string, public readonly username: string, public readonly message: string) {
    super(id);
  }
}
