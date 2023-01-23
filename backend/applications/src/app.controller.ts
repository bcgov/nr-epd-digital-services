import { Controller, Get, Post } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { Unprotected } from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
@Unprotected()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  printFormSubmission(@Req() request: Request) {
    console.log('Request from forms api');
    console.log(request.headers);
  }
}
