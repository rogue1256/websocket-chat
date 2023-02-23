import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../identifiableMessage";

export const LoginMessageRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal("loginMessage"),
    username: t.string,
    location: t.string,
    secret: t.string,
  }),
]);

export type LoginMessage = t.TypeOf<typeof LoginMessageRuntime>;
