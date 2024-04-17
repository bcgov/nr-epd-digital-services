import { Args, Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchSiteResponse } from '../dto/response/fetchSiteResponse';
import { Sites } from '../entities/sites.entity';
import { SiteService } from '../services/site.service';

/**
 * Resolver for Region
 */
@Resolver(() => Sites)
@Resource('site-service')
export class SiteResolver {
    constructor(private readonly siteService: SiteService) { }

    /**
     * Find All Sites
     */
    @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
    @Query(() => FetchSiteResponse, { name: 'sites' })
    findAll() {
        return this.siteService.findAll();
    }

    /**
    * Find sites where search parameter matches a site id or address
   * @param searchParam search parameter
   * @returns sites where id or address matches the search param
   */
    @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
    @Query(() => [Sites], { name: 'searchSites' })
    searchSites(@Args('searchParam', { type: () => String }) searchParam: string) {
        return this.siteService.searchSites(searchParam);
    }

    @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
    @Query(() => Sites, { name: 'findSiteBySiteId' })
    findSiteBySiteId(@Args('siteId', { type: () => String }) siteId: string) {
        return this.siteService.findSiteBySiteId(siteId);
    }
}
