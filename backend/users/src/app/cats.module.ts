import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { KeycloakService } from './services/keycloak.service';
import { LoggerService } from './logger/logger.service';
import { Person } from './entities/person.entity';
import { PersonResolver } from './resolvers/people.resolver';
import { PersonService } from './services/people.service';
/**
 * Module for wrapping all functionalities in user microserivce
 */
@Module({
  imports: [TypeOrmModule.forFeature([Person])],
  providers: [PersonResolver, PersonService, KeycloakService, LoggerService],
  controllers: [UserController],
})
export class CatsModule {}
