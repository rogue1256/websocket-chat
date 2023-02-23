import { TextMessage } from "./TextMessage";
import { LoginMessage } from "./LoginMessage";

export { TextMessageRuntimeType } from "./TextMessage";
export type { TextMessage } from "./TextMessage";
export { LoginMessageRuntimeType } from "./LoginMessage";
export type { LoginMessage } from "./LoginMessage";

export type OutgoingMessage = TextMessage | LoginMessage;
