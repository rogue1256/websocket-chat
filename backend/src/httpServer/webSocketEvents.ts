export interface WebsocketEvents {
  bytesReceived: (connectionId: string) => void;
  connectionClosed: (connectionId: string) => void;
  invalidJson: (connectionId: string, description?: string) => void;
  loginMessageReceived: (connectionId: string, data: { username: string; location: string }) => void;
  textMessageReceived: (connectionId: string, data: { message: string }) => void;
  pongReceived: (connectionId: string) => void;
  pingReceived: (connectionId: string) => void;
  messageWithoutLoginReceived: (connectionId: string) => void;
  closeDanglingConnection: (connectionId: string) => void;
}
