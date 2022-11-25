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

/**
 * Module for wrapping all functionalities in user microserivce
 */
@Module({
  imports: [TypeOrmModule.forFeature([ExternalUser, Region, OrganizationType])],
  providers: [
    ExternalUserResolver,
    ExternalUserService,
    RegionResolver,
    RegionService,
    OrganizationTypeResolver,
    OrganizationTypeService,
  ],
})
export class UsersModule {}
