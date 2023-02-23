import { LoginMessage } from "./loginMessage";
import { TextMessage } from "./textMessage";
import { MalformedMessage } from "./malformedMessage";

export { LoginMessage } from "./loginMessage";
export { TextMessage } from "./textMessage";
export { MalformedMessage } from "./malformedMessage";

export type IncomingMessage = LoginMessage | TextMessage | MalformedMessage;
