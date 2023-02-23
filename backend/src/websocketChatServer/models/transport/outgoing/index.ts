import { LoginBroadcast } from "./loginBroadcast";
import { LoginMessage } from "./loginMessage";
import { TextBroadcast } from "./textBroadcast";
import { ErrorMessage } from "./errorMessage";

export { TextBroadcast, TextBroadcastRuntime } from "./textBroadcast";
export { LoginBroadcast, LoginBroadcastRuntime } from "./loginBroadcast";
export { LoginMessage, LoginMessageRuntime } from "./loginMessage";
export { ErrorMessage, ErrorMessageRuntime } from "./errorMessage";

export type OutgoingMessage = LoginBroadcast | LoginMessage | TextBroadcast | ErrorMessage;
