import * as businessModels from "./chatMessages";
import * as transportModels from "./transport";

export const mapFromTransportLayer = (data: transportModels.IncomingMessage): businessModels.IncomingMessage => {
  switch (data.type) {
    case "errorMessage":
      return new businessModels.incomingModels.ErrorMessage(data.id, data.error, data.description);
    case "textBroadcast":
      return new businessModels.incomingModels.TextBroadcast(data.id, data.username, data.message);
    case "loginMessage":
      return new businessModels.incomingModels.LoginMessage(data.id, data.username, data.location, data.secret);
    case "loginBroadcast":
      return new businessModels.incomingModels.LoginBroadcast(data.id, data.username, data.location);
    default:
      throw new Error("Could not map anything");
  }
};

export const mapToTransportLayer = (msg: businessModels.OutgoingMessage): transportModels.OutgoingMessage => {
  switch (msg.type) {
    case "textFromUser":
      return {
        type: "textFromUser",
        text: msg.text,
        id: msg.id,
      };
    case "login":
      return {
        type: "login",
        id: msg.id,
        username: msg.username,
        secret: msg.secret,
      };
    default:
      // todo: better message
      throw new Error("Invalid mapper");
  }
};
