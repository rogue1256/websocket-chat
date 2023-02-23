import { IdentifiableMessage } from "../identifiableMessage";

export abstract class IncomingMessage implements IdentifiableMessage {
  public abstract readonly type: "login" | "textFromUser" | "malformedMessage";
  protected constructor(public readonly id: string) {}
}
