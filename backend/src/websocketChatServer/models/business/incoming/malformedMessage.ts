import { IncomingMessage } from "./incomingMessage";
import { nanoid } from "nanoid";

export class MalformedMessage extends IncomingMessage {
  public readonly type = "malformedMessage";

  constructor(public readonly errors: string[]) {
    super(nanoid());
  }
}
