import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  confirmFormSubmission(formRequest: Request): any {
    console.log('testing form submit');
    return formRequest;
  }
}
