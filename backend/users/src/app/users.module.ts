import { Module } from '@nestjs/common';
import { ExternalUserService } from './services/externalUser.service';
import { ExternalUserResolver } from './resolvers/externalUser.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalUser } from './entities/externalUser';
import { Region } from './entities/region';
import { OrganizationType } from './entities/organizationType';
import { RegionResolver } from './resolvers/region.resolver';
import { RegionService } from './services/region.service';
import { OrganizationTypeService } from './services/organizationType.service';
import { OrganizationTypeResolver } from './resolvers/organizationType.resolver';
import { UserController } from './controllers/user.controller';
import { KeycloakService } from './services/keycloak.service';
import { People } from './entities/people';
import { PeopleResolver } from './resolvers/people.resolver';
import { PeopleService } from './services/people.service';

/**
 * Module for wrapping all functionalities in user microserivce
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([ExternalUser, Region, OrganizationType, People]),
  ],
  providers: [
    PeopleResolver,
    PeopleService,
    ExternalUserResolver,
    ExternalUserService,
    RegionResolver,
    RegionService,
    OrganizationTypeResolver,
    OrganizationTypeService,
    KeycloakService,
  ],
  controllers: [UserController],
})
export class UsersModule {}
