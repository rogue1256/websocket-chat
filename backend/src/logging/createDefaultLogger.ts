import * as winston from "winston";

export const createDefaultLogger = (source?: string): winston.Logger => {
  const logger = winston.createLogger({
    level: (process.env["NODE_ENV"] ?? "production") === "production" ? "warn" : "debug",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.label({ label: source }),
          winston.format.simple()
        ),
      }),
    ],
  });

  return logger;
};
