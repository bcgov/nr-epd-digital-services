import { Request } from "express";

export class Helper {
  // Return request ID from http request header
  public static getUniqueRequestID(request: Request) {
    const { requestid } = request.headers;

    return requestid;
  }
}
