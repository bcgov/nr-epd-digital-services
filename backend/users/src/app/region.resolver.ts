import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchRegionResponse } from './dto/reponse/fetchRegionResponse';

import { Regions } from './entities/regions';
import { RegionService } from './region.service';

@Resolver(() => Regions)
@Resource('backend')
//@Unprotected()
export class RegionResolver {
  constructor(private readonly regionServiceLayer: RegionService) {}
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchRegionResponse, { name: 'regions' })
  findAll() {
    return this.regionServiceLayer.findAll();
  }

  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => Regions, { name: 'region' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.regionServiceLayer.findOne(id);
  }
}
