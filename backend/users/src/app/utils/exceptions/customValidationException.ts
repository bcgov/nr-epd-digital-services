import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomValidationException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super(
      {
        message,
        statusCode,
      },
      statusCode,
    );
  }
}
