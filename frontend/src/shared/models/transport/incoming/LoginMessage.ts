import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../IdentifiableMessage";

const loginMessageTypeLiteral = "loginMessage" as const;

export const LoginMessageRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal(loginMessageTypeLiteral),
    username: t.string,
    location: t.string,
    secret: t.string,
  }),
]);

export type LoginMessage = t.TypeOf<typeof LoginMessageRuntime>;

export const isLoginMessage = (data: unknown): data is LoginMessage => {
  // @ts-ignore
  return data.type === loginMessageTypeLiteral;
};
