import { BaseHttpResponse } from './baseHttpResponse';

export class GenericResponse<T> extends BaseHttpResponse {
  data?: T;
  constructor(
    message?: string,
    httpStatusCode?: number,
    success?: boolean,
    data?: T | null,
  ) {
    super(message, httpStatusCode, success);
    this.data = data;
  }
}

export class GenericPagedResponse<T> extends GenericResponse<T> {
  count?: number;
  page?: number;
  pageSize: number;
  constructor(
    message?: string,
    httpStatusCode?: number,
    success?: boolean,
    data?: T | null,
    count?: number,
    page?: number,
    pageSize?: number,
  ) {
    super(message, httpStatusCode, success, data);
    this.count = count;
    this.page = page;
    this.pageSize = pageSize;
  }
}
