import * as t from "io-ts";

export const SocketErrorsRuntimeType = t.keyof({
  wsUrlInvalid: null,
  unknownError: null,
});

export type SocketErrors = t.TypeOf<typeof SocketErrorsRuntimeType>;
