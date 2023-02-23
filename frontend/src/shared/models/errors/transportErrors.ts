import * as t from "io-ts";

export const TransportErrorsRuntimeType = t.keyof({
  messagingWhileNotLoggedIn: null,
  loginTaken: null,
  alreadyLoggedIn: null,
  bytesReceived: null,
  invalidJson: null,
});

export type TransportErrors = t.TypeOf<typeof TransportErrorsRuntimeType>;
