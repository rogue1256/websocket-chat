import * as http from "http";
import { createDefaultLogger } from "../logging";

const NOT_FOUND_RESPONSE_CODE = 404;
const HTTP_SERVER_DEFAULT_PORT = 8080;

const logger = createDefaultLogger("server");

export const getHttpServer = (): http.Server => {
  const portParsed = parseInt(process.env["NODE_PORT"] ?? "");
  const port = isNaN(portParsed) ? HTTP_SERVER_DEFAULT_PORT : portParsed;
  const server = http.createServer(function (request, response) {
    logger.info(`Received request for ${request.url ?? ""}`);
    response.writeHead(NOT_FOUND_RESPONSE_CODE);
    response.end();
  });

  server.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
  });

  return server;
};
