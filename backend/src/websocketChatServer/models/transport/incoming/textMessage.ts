import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../identifiableMessage";

const textMessageLiteral = "textFromUser" as const;

export const TextMessageRuntimeType = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal(textMessageLiteral),
    id: t.string,
    text: t.string,
  }),
]);

export type TextMessage = t.TypeOf<typeof TextMessageRuntimeType>;

export const isTextMessage = (data: unknown): data is TextMessage => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return data.type === textMessageLiteral;
};
