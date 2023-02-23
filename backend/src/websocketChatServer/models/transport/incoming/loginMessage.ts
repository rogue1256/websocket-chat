import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../identifiableMessage";

const loginLiteral = "login" as const;

export const LoginMessageRuntimeType = t.intersection([
  IdentifiableMessageRuntime,
  t.intersection([
    t.type({
      type: t.literal(loginLiteral),
      id: t.string,
      username: t.string,
    }),
    t.partial({ secret: t.string }),
  ]),
]);

export type LoginMessage = t.TypeOf<typeof LoginMessageRuntimeType>;

export const isLoginMessage = (data: unknown): data is LoginMessage => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return data.type === loginLiteral;
};
