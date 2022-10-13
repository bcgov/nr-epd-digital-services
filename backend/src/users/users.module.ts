import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { Users } from "./entities/users.entity";
import { UsersResolver } from './users.resolver';
import { ApplicationsService } from "src/applications/applications.service";

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService, UsersResolver],
  exports:[UsersService]
})
export class UsersModule {}
