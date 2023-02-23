import { OutgoingMessage } from "./OutgoingMessage";

export class TextMessage extends OutgoingMessage {
  public readonly type = "textFromUser";

  constructor(public readonly text: string) {
    super();
  }
}
