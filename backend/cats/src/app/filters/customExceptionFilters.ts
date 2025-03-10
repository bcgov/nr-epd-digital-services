import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GenericResponse } from '../dto/response/genericResponse';

@Catch()
export class CustomExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const messageResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const message =
      typeof messageResponse === 'string'
        ? messageResponse
        : messageResponse['message'];

    // Format the error response
    return new GenericResponse(message, status, false, null);
  }
}
