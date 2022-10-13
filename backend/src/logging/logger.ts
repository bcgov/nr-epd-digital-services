import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";
import * as winston from "winston";
import "winston-daily-rotate-file";

export class Logger {
  public static WinstonLogger() {
    return {
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike()
          ),
        })//,
        /*new winston.transports.DailyRotateFile({
          filename: process.env.LOGGER_FILE_NAME,
          dirname: process.env.LOGGER_DIR_NAME,
          level: process.env.LOGGER_LEVEL,
          handleExceptions:
            process.env.LOGGER_HANDLE_EXCEPTIONS == "true" ? true : false,
          json: process.env.LOGGER_JSON == "true" ? true : false,
          zippedArchive:
            process.env.LOGGER_ZIP_ARCHIVE == "true" ? true : false,
          maxSize: process.env.LOGGER_MAX_SIZE,
          maxFiles: process.env.LOGGER_MAX_FILES,
        }),*/
      ],
    };
  }
}
