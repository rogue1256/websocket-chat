import { IncomingMessage } from "../IncomingMessage";
import { ErrorMessageType } from "./ErrorType";

export class ErrorMessage extends IncomingMessage {
  public readonly type = "errorMessage";

  constructor(
    public readonly id: string,
    public readonly error: ErrorMessageType,
    public readonly description?: string
  ) {
    super(id);
  }
}
