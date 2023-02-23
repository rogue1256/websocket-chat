import { ErrorMessage } from "./errorMessage";
import { LoginMessage } from "./loginMessage";
import { TextBroadcast } from "./textBroadcast";
import { LoginBroadcast } from "./loginBroadcast";

export { ErrorMessage } from "./errorMessage";
export { LoginMessage } from "./loginMessage";
export { TextBroadcast } from "./textBroadcast";
export { LoginBroadcast } from "./loginBroadcast";
export type { ErrorMessageType } from "./errorMessage";

export type OutgoingMessage = ErrorMessage | LoginMessage | TextBroadcast | LoginBroadcast;
