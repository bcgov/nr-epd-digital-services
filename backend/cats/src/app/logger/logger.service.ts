import { Injectable } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';
import * as rTracer from 'cls-rtracer';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv';

dotenv.config();
const { timestamp, combine, printf } = format;

@Injectable()
export class LoggerService {
  private logger;

  constructor() {
    this.logger = this.buildLogger();
  }

  private buildLogger() {
    const logFormat = printf(({ level, message, timestamp }) => {
      const requestId = rTracer.id();
      return requestId
        ? `${timestamp} ${level}: [request-id:${requestId}] ${message}`
        : `${timestamp}: ${message}`;
    });

    return createLogger({
      format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        format.errors({ stack: true }),
        logFormat,
      ),
      transports: [
        new transports.Console({
          level: process.env.LOG_LEVEL || 'info',
          handleExceptions: true,
        }),
        new transports.DailyRotateFile({
          level: process.env.LOG_LEVEL,
          filename: process.env.LOG_FILE_LOCATION,
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          handleExceptions: true,
          json: true,
          maxSize: process.env.LOG_FILE_MAX_SIZE,
          maxFiles: process.env.LOG_FILE_MAX_FILES,
        }),
      ],
      exitOnError: false,
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
