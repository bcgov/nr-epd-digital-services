import { Args, Int, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import {
  Resource,
  RoleMatchingMode,
  Roles,
  Unprotected,
} from 'nest-keycloak-connect';
import { FetchRegionResponse } from './dto/reponse/fetch-region-response';

import { Region } from './entities/region.entity';
import { RegionService } from './region.service';

@Resolver(() => Region)
@Resource('backend')
//@Unprotected()
export class RegionResolver {
  constructor(private readonly regionServiceLayer: RegionService) {}
  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchRegionResponse, { name: 'regions' })
  findAll() {
    return this.regionServiceLayer.findAll();
  }

  // @ResolveReference()
  // resolveReference(ref:{_typename:string, id:number}){
  //   return this.regionServiceLayer.findOne(ref.id);
  // }

  @Roles({ roles: ['adminbackend'], mode: RoleMatchingMode.ANY })
  @Query(() => Region, { name: 'region' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.regionServiceLayer.findOne(id);
  }
}
