import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Req } from '@nestjs/common/decorators';
import { Resource, Unprotected } from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { Request } from 'express';

@ApiTags('general')
@Controller()
@Resource('cats-service')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Unprotected()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Returns a simple hello world message'
  })
  @ApiResponse({
    status: 200,
    description: 'Hello message returned successfully',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
