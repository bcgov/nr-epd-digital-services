import { Query, Resolver } from '@nestjs/graphql';
import { Resource, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { FetchSiteResponse } from '../dto/response/fetchSiteResponse';
import { Sites } from '../entities/sites.entity';
import { SiteService } from '../services/site.service';

/**
 * Resolver for Region
 */
@Resolver(() => Sites)
@Resource('user-service')
export class SitesResolver {
    constructor(private readonly siteService: SiteService) { }

    /**
     * Find All Sites
     */
    @Roles({ roles: ['site-admin'], mode: RoleMatchingMode.ANY })
    @Query(() => FetchSiteResponse, { name: 'sites' })
    findAll() {
        return this.siteService.findAll();
    }
}
