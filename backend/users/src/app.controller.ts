import { Controller, Get } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { AppService } from './app.service';

/**
 * Unprotected Sample Controller For Health Check
 */
@Controller()
@Unprotected()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * GET Method
   * @returns Hello World
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
