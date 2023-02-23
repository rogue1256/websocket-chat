import * as t from "io-ts";

export const IdentifiableMessageRuntime = t.type({
  id: t.string,
});

export type IdentifiableMessage = t.TypeOf<typeof IdentifiableMessageRuntime>;
