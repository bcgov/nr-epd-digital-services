import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExternalUsers } from './entities/user.entity';
import { Region } from './entities/region.entity';
import { OrganizationType } from './entities/organizationType.entity';
import { RegionResolver } from './region.resolver';
import { RegionService } from './region.service';
import { OrganizationTypeService } from './organizationType.service';
import { OrganizationTypeResolver } from './organizationType.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExternalUsers, Region, OrganizationType]),
  ],
  providers: [
    UsersResolver,
    UsersService,
    RegionResolver,
    RegionService,
    OrganizationTypeResolver,
    OrganizationTypeService,
  ],
})
export class UsersModule {}
