import { Controller, Get } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { FetchSiteResponse } from '../dto/response/fetchSiteResponse';
import { SiteService } from '../services/site.service';

@Controller('site')
@Unprotected()
export class SiteController {
    constructor(private siteService: SiteService) { }
    /**
     * Get all sites
     * @returns all sites
     */
    @Get('/') async getSubmission(): Promise<FetchSiteResponse> {
        const sites = await this.siteService.findAll();

        if (sites?.data.length == 0) {
            return Promise.reject({
                statusCode: 404,
                message: 'Form data not found',
            });
        }
        return sites;
    }

}
