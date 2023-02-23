import * as yup from "yup";
import { WSS_URL_REGEX } from "../../shared/Constants";

export type LoginFormInputs = {
  username: string;
  serverAddress: string;
};

export const validationSchema = yup.object({
  username: yup.string().trim().required("Username should not be empty"),
  serverAddress: yup
    .string()
    .trim()
    .required("Server Address should not be empty")
    .matches(WSS_URL_REGEX, `The server address should match ws://url format`),
});
