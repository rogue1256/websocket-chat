import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../IdentifiableMessage";

const textBroadcastTypeLiteral = "textBroadcast" as const;

export const TextBroadcastRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal(textBroadcastTypeLiteral),
    username: t.string,
    message: t.string,
  }),
]);

export type TextBroadcast = t.TypeOf<typeof TextBroadcastRuntime>;

export const isTextBroadcast = (data: unknown): data is TextBroadcast => {
  // @ts-ignore
  return data.type === textBroadcastTypeLiteral;
};
