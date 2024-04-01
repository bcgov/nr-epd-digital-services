import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { FetchSiteResponse } from '../dto/response/fetchSiteResponse';
import { Sites } from '../entities/sites.entity';

/**
 * Nestjs Service For Region Entity
 */
@Injectable()
export class SiteService {
    constructor(
        @InjectRepository(Sites)
        private siteRepository: Repository<Sites>,
    ) { }

    /**
     * Find All method for returining all sites
     * @returns FetchSiteResponse -- returns sites
     */
    async findAll() {
        const response = new FetchSiteResponse();

        response.httpStatusCode = 200;

        response.data = await this.siteRepository.find();

        return response;
    }

    /**
      * Find sites where search parameter matches a site id or address
     * @param searchParam search parameter
     * @returns sites where id or address matches the search param
     */
    async searchSites(searchParam: string) {
        const sites = await this.siteRepository.createQueryBuilder("sites")
            .where("CAST(sites.id AS TEXT) like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.addr_line_1 like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.addr_line_2 like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.addr_line_3 like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.addr_line_4 like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.city like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.provState like :searchParam", { searchParam: `%${searchParam}%` })
            .orWhere("sites.postalCode like :searchParam", { searchParam: `%${searchParam}%` })
            .getMany();

        return sites;
    }
}
