import * as t from "io-ts";
import { IdentifiableMessageRuntime } from "../IdentifiableMessage";
import { TransportErrorsRuntimeType } from "../../errors/transportErrors";

const errorMessageTypeLiteral = "errorMessage" as const;

export const ErrorMessageRuntime = t.intersection([
  IdentifiableMessageRuntime,
  t.intersection([
    t.type({
      type: t.literal(errorMessageTypeLiteral),
      // todo: code duplication with BE
      error: TransportErrorsRuntimeType,
    }),
    t.partial({ description: t.string }),
  ]),
]);

export type ErrorMessage = t.TypeOf<typeof ErrorMessageRuntime>;

export const isErrorMessage = (data: unknown): data is ErrorMessage => {
  // @ts-ignore
  return data.type === errorMessageTypeLiteral;
};
