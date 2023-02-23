import { LoginMessage, TextMessage } from "./ChatMessages";
export { LoginMessage, TextMessage } from "./ChatMessages";

export type { ChatError } from "./Errors";
export type ChatMessage = LoginMessage | TextMessage;
