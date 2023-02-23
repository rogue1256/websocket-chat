import { IncomingMessage } from "./incomingMessage";

export class TextMessage extends IncomingMessage {
  public readonly type = "textFromUser";

  constructor(id: string, public readonly text: string) {
    super(id);
  }
}
