export enum StatusCode {
  NormalClosure = 1000,
  GoingAway = 1001,
  ProtocolError = 1002,
  UnsupportedData = 1003,
  Reserved1004 = 1004,
  NoStatus = 1005,
  AbnormalClosure = 1006,
  InvalidDataType = 1007,
  PolicyViolation = 1008,
  MessageTooBig = 1009,
  MissingExtensions = 1010,
  InternalServerError = 1011,
  TLSHandshakeFailed = 1015,
  UnknownCode = 4000,
  NoConnectionBeforeTimeout = 4001,
  WebsocketClosedAfterError = 4002,
}

export const safeMapNumberToStatusCode = (code: number): StatusCode => {
  switch (code) {
    case 1000:
      return StatusCode.NormalClosure;
    case 1001:
      return StatusCode.GoingAway;
    case 1002:
      return StatusCode.ProtocolError;
    case 1003:
      return StatusCode.UnsupportedData;
    case 1004:
      return StatusCode.Reserved1004;
    case 1005:
      return StatusCode.NoStatus;
    case 1006:
      return StatusCode.AbnormalClosure;
    case 1007:
      return StatusCode.InvalidDataType;
    case 1008:
      return StatusCode.PolicyViolation;
    case 1009:
      return StatusCode.MessageTooBig;
    case 1010:
      return StatusCode.MissingExtensions;
    case 1011:
      return StatusCode.InternalServerError;
    case 1015:
      return StatusCode.TLSHandshakeFailed;
    case 4001:
      return StatusCode.NoConnectionBeforeTimeout;
    case 4002:
      return StatusCode.WebsocketClosedAfterError;
    default:
      return StatusCode.UnknownCode;
  }
};
