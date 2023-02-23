import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../identifiableMessage";

export const LoginBroadcastRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal("loginBroadcast"),
    username: t.string,
    location: t.string,
  }),
]);

export type LoginBroadcast = t.TypeOf<typeof LoginBroadcastRuntime>;
