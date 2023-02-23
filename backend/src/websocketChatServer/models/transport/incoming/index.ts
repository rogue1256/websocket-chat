import { TextMessage } from "./textMessage";
import { LoginMessage } from "./loginMessage";

export { TextMessage, TextMessageRuntimeType, isTextMessage } from "./textMessage";
export { LoginMessage, LoginMessageRuntimeType, isLoginMessage } from "./loginMessage";

export type IncomingMessage = TextMessage | LoginMessage;
