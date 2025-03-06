import { Injectable } from '@nestjs/common';

/**
 * Sample Service Class for App Controller
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
