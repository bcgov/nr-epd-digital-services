import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Unprotected Sample Controller For Health Check
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET Method
   * @returns Hello World
   */
  @Get()
  async getConnection(): Promise<string> {
    return await this.appService.getConnection();
  }
}
