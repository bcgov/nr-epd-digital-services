import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchRegionResponse } from '../dto/reponse/fetchRegionResponse';
import { Region } from '../entities/region';
import { RegionService } from '../services/region.service';

/**
 * Resolver for Region
 */
@Resolver(() => Region)
@Resource('user-service')
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  /**
   * Find All For Regions
   */
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  @Query(() => FetchRegionResponse, { name: 'regions' })
  findAll() {
    return this.regionService.findAll();
  }

  /**
   * Find One Region
   * @param id region id
   * @returns Specific Region
   */
  @Roles({ roles: ['user-admin'], mode: RoleMatchingMode.ANY })
  @Query(() => Region, { name: 'region' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.regionService.findOne(id);
  }
}
