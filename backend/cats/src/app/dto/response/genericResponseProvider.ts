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

  createPagedResponse({
    message,
    httpStatusCode,
    success,
    data,
    count,
    page,
    pageSize,
  }: {
    message?: string;
    httpStatusCode?: number;
    success?: boolean;
    data?: T | null;
    count?: number
    page?: number;
    pageSize?: number;
  }): GenericPagedResponse<T> {
    return new GenericPagedResponse<T>(
      message,
      httpStatusCode,
      success,
      data,
      count,
      page,
      pageSize,
    );
  }
}
