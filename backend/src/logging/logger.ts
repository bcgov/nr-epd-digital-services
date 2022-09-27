import {
    utilities as nestWinstonModuleUtilities,
    WinstonModule,
  } from 'nest-winston';
  import * as winston from 'winston';
  import 'winston-daily-rotate-file';

export class Logger
{
    public static WinstonLogger()
    {
       return {
            transports: [
              new winston.transports.Console({
                format: winston.format.combine(
                  winston.format.timestamp(),
                  nestWinstonModuleUtilities.format.nestLike(),
                ),
              }),
              new winston.transports.DailyRotateFile ({
                filename: 'application-%DATE%.log',
                dirname: `./logs`,
                level: 'info',
                handleExceptions: true,            
                json: false,
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'        
            })
            ],
          }
    }

}