import { Body, Controller, Get, Post } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { AppService } from './app.service';

@Controller()
@Unprotected()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  CreateUser(@Body() input): boolean {
    console.log('input', input);
    return true;
  }
}
