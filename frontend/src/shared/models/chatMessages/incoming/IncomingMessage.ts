import { IdentifiableMessage } from "../IdentifiableMessage";

export abstract class IncomingMessage implements IdentifiableMessage {
  // todo: this might get lot in maintenance
  public abstract readonly type: "loginBroadcast" | "loginMessage" | "textBroadcast" | "errorMessage";

  protected constructor(public readonly id: string) {}
}
