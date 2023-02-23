import { IdentifiableMessage } from "../IdentifiableMessage";
import { nanoid } from "nanoid";

export abstract class OutgoingMessage implements IdentifiableMessage {
  public abstract readonly type: "login" | "textFromUser";

  public readonly id = nanoid();
}
