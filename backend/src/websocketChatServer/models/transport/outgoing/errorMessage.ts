import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../identifiableMessage";

export const ErrorMessageRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.intersection([
    t.type({
      type: t.literal("errorMessage"),
      error: t.keyof({
        messagingWhileNotLoggedIn: null,
        loginTaken: null,
        alreadyLoggedIn: null,
        bytesReceived: null,
        invalidJson: null,
      }),
    }),
    t.partial({ description: t.string }),
  ]),
]);

export type ErrorMessage = t.TypeOf<typeof ErrorMessageRuntime>;
