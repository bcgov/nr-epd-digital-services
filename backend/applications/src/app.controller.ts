import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Req } from '@nestjs/common/decorators';
import { Resource, Unprotected } from 'nest-keycloak-connect';
import { AppService } from './app.service';
import { Request } from 'express';

/**
 * Main application controller
 * Handles general application endpoints
 * 
 * @ApiTags - Groups endpoints under 'general' in Swagger UI
 * @Resource - Keycloak resource name for authorization
 */
@ApiTags('general')
@Controller()
@Resource('cats-service')
export class AppController {
  constructor(private readonly appService: AppService) { }

  /**
   * Health check endpoint
   * Returns a simple hello world message
   * 
   * @returns {string} Hello World message
   * 
   * @ApiOperation - Provides summary and description in Swagger
   * @ApiResponse - Documents the response structure and status codes
   * @Unprotected - Bypasses Keycloak authentication for this endpoint
   */
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
