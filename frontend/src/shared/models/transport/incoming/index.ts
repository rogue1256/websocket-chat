import { LoginBroadcast } from "./LoginBroadcast";
import { LoginMessage } from "./LoginMessage";
import { TextBroadcast } from "./TextBroadcast";
import { ErrorMessage } from "./ErrorMessage";

export { TextBroadcastRuntime, isTextBroadcast } from "./TextBroadcast";
export type { TextBroadcast } from "./TextBroadcast";
export { LoginBroadcastRuntime, isLoginBroadcast } from "./LoginBroadcast";
export type { LoginBroadcast } from "./LoginBroadcast";
export { LoginMessageRuntime, isLoginMessage } from "./LoginMessage";
export type { LoginMessage } from "./LoginMessage";
export { ErrorMessageRuntime, isErrorMessage } from "./ErrorMessage";
export type { ErrorMessage } from "./ErrorMessage";

export type IncomingMessage = LoginBroadcast | LoginMessage | TextBroadcast | ErrorMessage;
