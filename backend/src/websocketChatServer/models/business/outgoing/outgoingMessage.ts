import { IdentifiableMessage } from "../identifiableMessage";
import { nanoid } from "nanoid";

export abstract class OutgoingMessage implements IdentifiableMessage {
  public abstract readonly type: "loginBroadcast" | "loginMessage" | "textBroadcast" | "errorMessage";

  public readonly id = nanoid();
}
