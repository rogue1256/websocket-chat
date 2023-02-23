import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../identifiableMessage";

export const TextBroadcastRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.type({
    type: t.literal("textBroadcast"),
    username: t.string,
    message: t.string,
  }),
]);

export type TextBroadcast = t.TypeOf<typeof TextBroadcastRuntime>;
