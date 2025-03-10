import { Injectable } from '@nestjs/common';
import { GenericPagedResponse, GenericResponse } from './genericResponse';

@Injectable()
export class GenericResponseProvider<T> {
  createResponse(
    message?: string,
    httpStatusCode?: number,
    success?: boolean,
    data?: T | null,
  ): GenericResponse<T> {
    return new GenericResponse<T>(message, httpStatusCode, success, data);
  }
}
