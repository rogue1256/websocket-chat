import { SocketErrorsRuntimeType } from "./socketError";
import { TransportErrorsRuntimeType } from "./transportErrors";
import * as t from "io-ts";

export const ChatWebsocketErrorRuntimeType = t.union([SocketErrorsRuntimeType, TransportErrorsRuntimeType]);

export type ChatWebSocketError = t.TypeOf<typeof ChatWebsocketErrorRuntimeType>;

export type { SocketErrors } from "./socketError";
export type { TransportErrors } from "./transportErrors";
