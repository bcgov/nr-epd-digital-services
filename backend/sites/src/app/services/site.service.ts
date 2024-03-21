import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
