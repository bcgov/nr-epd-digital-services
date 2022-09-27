import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  LoggerService,
  Req
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { request } from "http";
import { Request } from 'express';
import { Helper } from "src/common/helpers";
import { REQUEST } from '@nestjs/core';

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @Inject(REQUEST) private readonly request: Request 
    ) {
      this.logger.log("requestID",Helper.getUniqueRequestID(request));
        }

  @Post()
  create(@Req() request: Request,@Body() createUserDto: CreateUserDto) {
        //this.logger.log("requestID",Helper.getUniqueRequestID(request));
        return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Req() request: Request) {    
    //this.logger.log("requestID",Helper.getUniqueRequestID(request));
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string ) {
    //this.logger.log("requestID",Helper.getUniqueRequestID(request));
    return this.usersService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    //this.logger.log("requestID",Helper.getUniqueRequestID(request));
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    //this.logger.log(request);
    return this.usersService.remove(+id);
  }
}
