import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../IdentifiableMessage";
const loginLiteral = "login" as const;

export const LoginMessageRuntimeType = t.intersection([
  IdentifiableMessageRuntime,
  t.intersection([
    t.type({
      type: t.literal(loginLiteral),
      username: t.string,
    }),
    t.partial({ secret: t.string }),
  ]),
]);

export type LoginMessage = t.TypeOf<typeof LoginMessageRuntimeType>;
