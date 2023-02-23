import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../IdentifiableMessage";

const textMessageTypeLiteral = "textFromUser" as const;

export const TextMessageRuntimeType = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal(textMessageTypeLiteral),
    text: t.string,
  }),
]);

export type TextMessage = t.TypeOf<typeof TextMessageRuntimeType>;
