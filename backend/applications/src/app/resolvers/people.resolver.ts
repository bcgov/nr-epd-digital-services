import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { People } from '../entities/people.entity';
import { AuthenticatedUser } from 'nest-keycloak-connect';

@Resolver(() => People)
export class PeopleResolver {
  // @Query(() => SearchSiteResponse, { name: 'searchSites' })
  // async searchSites(
  //   @AuthenticatedUser() userInfo,
  //   @Args('searchParam', { type: () => String }) searchParam: string,
  //   @Args('page', { type: () => Int }) page: number,
  //   @Args('pageSize', { type: () => Int }) pageSize: number,
  //   @Args('filters', { type: () => SiteFilters })
  //   filters: SiteFilters,
  // ) {
  //   return
  // }
}
