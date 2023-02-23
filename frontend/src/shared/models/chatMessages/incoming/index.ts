import { ErrorMessage } from "./errorMessage";
import { LoginMessage } from "./LoginMessage";
import { TextBroadcast } from "./TextBroadcast";
import { LoginBroadcast } from "./LoginBroadcast";

export { ErrorMessage } from "./errorMessage";
export { LoginMessage } from "./LoginMessage";
export { TextBroadcast } from "./TextBroadcast";
export { LoginBroadcast } from "./LoginBroadcast";
export type { ErrorMessageType } from "./errorMessage";

export type IncomingMessage = ErrorMessage | LoginMessage | TextBroadcast | LoginBroadcast;
