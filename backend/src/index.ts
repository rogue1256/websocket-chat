import { graceExitCode, HEARTBEAT_START_TIMEOUT_MS } from "./helpers";
import { getHttpServer } from "./httpServer";
import { WebsocketChatServer } from "./websocketChatServer";
import { createDefaultLogger } from "./logging";
import { InMemoryLoginProvider, LoginProvider } from "./loginStorage";

const logger = createDefaultLogger("main");

const httpServer = getHttpServer();

const loginProvider: LoginProvider = new InMemoryLoginProvider();

const chatServer = new WebsocketChatServer(httpServer, loginProvider);
setTimeout(() => {
  chatServer.startHeartbeat();
}, HEARTBEAT_START_TIMEOUT_MS);

process.on("SIGINT", () => {
  logger.info("Received a SIGINT signal. Shutting down.");
  process.exit(graceExitCode);
});

process.on("SIGTERM", () => {
  logger.info("Received a SIGTERM signal. Shutting down.");
  process.exit(graceExitCode);
});
