import { LoginMessage } from "./LoginMessage";
import { TextMessage } from "./TextMessage";

export { LoginMessage } from "./LoginMessage";
export { TextMessage } from "./TextMessage";

export type OutgoingMessage = LoginMessage | TextMessage;
