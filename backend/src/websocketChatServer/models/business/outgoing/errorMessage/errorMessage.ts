import { OutgoingMessage } from "../outgoingMessage";
import { ErrorMessageType } from "./errorType";

export class ErrorMessage extends OutgoingMessage {
  public readonly type = "errorMessage";

  constructor(public readonly error: ErrorMessageType, public readonly description?: string) {
    super();
  }
}
