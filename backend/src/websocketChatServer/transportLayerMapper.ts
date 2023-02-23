import * as businessModels from "./models/business";
import * as transportModels from "./models/transport";
import { isRight } from "fp-ts/Either";
import { isLoginMessage, isTextMessage } from "./models/transport/incoming";
import { PathReporter } from "io-ts/PathReporter";
import { MalformedMessage } from "./models/business/incoming";

export const mapFromTransportLayer = (data: string): businessModels.IncomingMessage => {
  const parsedJson = parseJson(data);

  if (isTextMessage(parsedJson)) {
    return tryParseTextMessage(parsedJson);
  }

  if (isLoginMessage(parsedJson)) {
    return tryParseLoginMessage(parsedJson);
  }

  return new MalformedMessage(["type keyword provided does not correspond to any known types"]);
};

export const mapToTransportLayer = (message: businessModels.OutgoingMessage): transportModels.OutgoingMessage => {
  switch (message.type) {
    case "errorMessage":
      return { type: "errorMessage", error: message.error, id: message.id, description: message.description };
    case "loginMessage":
      return {
        type: "loginMessage",
        id: message.id,
        username: message.username,
        location: message.location,
        secret: message.secret,
      };
    case "textBroadcast":
      return {
        type: "textBroadcast",
        id: message.id,
        username: message.username,
        message: message.message,
      };
    case "loginBroadcast":
      return {
        type: "loginBroadcast",
        id: message.id,
        username: message.username,
        location: message.location,
      };
    default:
      throw new Error("Something wasn't mapped. Check your mapper!");
  }
};

export const stringifyTransportModel = (model: transportModels.OutgoingMessage): string => {
  return JSON.stringify(model);
};

const parseJson = (payload: string): unknown | null => {
  try {
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
};

const tryParseTextMessage = (
  textMessage: transportModels.incomingModels.TextMessage
): businessModels.incomingModels.TextMessage | businessModels.incomingModels.MalformedMessage => {
  const textMessageDecoded = transportModels.incomingModels.TextMessageRuntimeType.decode(textMessage);
  if (isRight(textMessageDecoded)) {
    const textMessage = textMessageDecoded.right;
    return new businessModels.incomingModels.TextMessage(textMessage.id, textMessage.text);
  }

  return new MalformedMessage(PathReporter.report(textMessageDecoded));
};

const tryParseLoginMessage = (
  loginMessage: transportModels.incomingModels.LoginMessage
): businessModels.incomingModels.LoginMessage | businessModels.incomingModels.MalformedMessage => {
  const loginMessageDecoded = transportModels.incomingModels.LoginMessageRuntimeType.decode(loginMessage);
  if (isRight(loginMessageDecoded)) {
    const loginMessage = loginMessageDecoded.right;
    return new businessModels.incomingModels.LoginMessage(loginMessage.id, loginMessage.username, loginMessage.secret);
  }

  return new MalformedMessage(PathReporter.report(loginMessageDecoded));
};
