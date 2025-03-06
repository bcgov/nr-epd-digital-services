import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    HttpStatus,
  } from '@nestjs/common';
import { CustomValidationException } from '../exceptions/customValidationException';
  
  
  @Injectable()
  export class GenericValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
      try {
        if (
          metadata.metatype.name === 'String' &&
          (value === undefined || value === null || value.trim().length === 0)
        ) {
          throw new CustomValidationException(
            `Invalid ${metadata.type} must not be empty.`,
            HttpStatus.BAD_REQUEST,
          );
        }
  
        if (metadata.metatype.name === 'Number' && (isNaN(value) || value <= 0)) {
          throw new CustomValidationException(
            `Invalid ${metadata.type} must not be string, negative or zero.`,
            HttpStatus.BAD_REQUEST,
          );
        }
  
        return value;
      } catch (error) {
        throw error instanceof CustomValidationException
          ? error
          : new CustomValidationException(
              'Validation failed',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
      }
    }
  }
  