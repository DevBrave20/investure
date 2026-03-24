import { createLogger, transports, format } from "winston";

const timestampDefinition = { format: 'YYYY-MM-DDTHH:mm:ss.SSS Z' };

const logger = createLogger({
  transports: [new transports.Console(
    {
      format: format.combine(
        format.colorize(),
        format.timestamp(timestampDefinition)
      ),
    }
  )],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

export default logger;
