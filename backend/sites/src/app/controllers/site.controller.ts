import { Controller, Get, Param } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { FetchSiteDetail, FetchSiteResponse } from '../dto/response/fetchSiteResponse';
import { SiteService } from '../services/site.service';

@Controller('site')
@Unprotected()
export class SiteController {
    constructor(private siteService: SiteService) { }
    /**
     * Get all sites
     * @returns all sites
     */
    @Get('/') async getAllSites(): Promise<FetchSiteResponse> {
        const sites = await this.siteService.findAll();

        if (sites?.data.length == 0) {
            return Promise.reject({
                statusCode: 404,
                message: 'Site data not found',
            });
        }
        return sites;
    }

    /**
    * Get site by site Id
    * @returns site matching the site id
    */
    @Get('/:siteId') async getSiteBySiteId(@Param('siteId') siteId): Promise<FetchSiteDetail> {
        const site = await this.siteService.findSiteBySiteId(siteId);

        if (!site) {
            return Promise.reject({
                statusCode: 404,
                message: 'Site data not found',
            });
        }

        return site;
    }
}
