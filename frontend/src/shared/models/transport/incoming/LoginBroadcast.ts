import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../IdentifiableMessage";

const loginBroadcastLiteral = "loginBroadcast" as const;
export const LoginBroadcastRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal(loginBroadcastLiteral),
    username: t.string,
    location: t.string,
  }),
]);

export type LoginBroadcast = t.TypeOf<typeof LoginBroadcastRuntime>;

export const isLoginBroadcast = (data: unknown): data is LoginBroadcast => {
  // @ts-ignore
  return data.type === loginBroadcastLiteral;
};
