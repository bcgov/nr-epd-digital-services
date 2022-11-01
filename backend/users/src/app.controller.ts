import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserInput } from './users/dto/create-user.input';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  CreateUser(@Body() input):boolean
  {
    console.log("input",input);
    return true;
  }

}
