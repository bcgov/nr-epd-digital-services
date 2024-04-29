import { Args, Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchSiteResponse, SearchSiteResponse } from '../dto/response/fetchSiteResponse';
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
   * @param page page number
   * @param pageSize size of the page
   * @returns sites where id or address matches the search param along with pagination params
   */
    @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
    @Query(() => SearchSiteResponse, { name: 'searchSites' })
    searchSites(@Args('searchParam', { type: () => String }) searchParam: string,
        @Args('page', { type: () => String }) page: number,
        @Args('pageSize', { type: () => String }) pageSize: number,
        @Args('siteId', { type: () => String }) siteId?: string,
        @Args('siteRemediationStatus', { type: () => String }) siteRemediationStatus?: string,
        @Args('siteRiskCode', { type: () => String }) siteRiskCode?: string,
        @Args('commonName', { type: () => String }) commonName?: string,
        @Args('siteAddress', { type: () => String }) siteAddress?: string,
        @Args('city', { type: () => String }) city?: string,
        @Args('createdBy', { type: () => String }) createdBy?: string,
        @Args('latLongReliability', { type: () => String }) latLongReliability?: string,
        @Args('latDecimal', { type: () => String }) latDecimal?: number,
        @Args('latDeg', { type: () => String }) latDeg?: number,
        @Args('latMin', { type: () => String }) latMin?: number,
        @Args('latSec', { type: () => String }) latSec?: string,
        @Args('longDecimal', { type: () => String }) longDecimal?: number,
        @Args('longDeg', { type: () => String }) longDeg?: number,
        @Args('longMin', { type: () => String }) longMin?: number,
        @Args('longSec', { type: () => String }) longSec?: string,
        @Args('dateCreated', { type: () => String }) dateCreated?: Date,
        @Args('lastUpdated', { type: () => String }) lastUpdated?: Date) {
        return this.siteService.searchSites(searchParam, page, pageSize, siteId, siteRemediationStatus, siteRiskCode, commonName,
            siteAddress, city, createdBy, latLongReliability, latDecimal, latDeg, latMin, latSec, longDecimal, longDeg,
            longMin, longSec, dateCreated, lastUpdated);
    }

    @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
    @Query(() => Sites, { name: 'findSiteBySiteId' })
    findSiteBySiteId(@Args('siteId', { type: () => String }) siteId: string) {
        return this.siteService.findSiteBySiteId(siteId);
    }
}
