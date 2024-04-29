import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FetchSiteDetail, FetchSiteResponse, SearchSiteResponse } from '../dto/response/fetchSiteResponse';
import { Sites } from '../entities/sites.entity';
import { SiteUtil } from '../utils/site.util';
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
    async searchSites(searchParam: string, page: number, pageSize: number, siteId?: string, siteRemediationStatus?: string,
        siteRiskCode?: string, commonName?: string, siteAddress?: string, city?: string, createdBy?: string, latLongReliability?: string,
        latDecimal?: number, latDeg?: number, latMin?: number, latSec?: string, longDecimal?: number, longDeg?: number, longMin?: number,
        longSec?: string, dateCreated?: Date, lastUpdated?: Date) {
        const siteUtil: SiteUtil = new SiteUtil();
        const response = new SearchSiteResponse();

        const query = await this.siteRepository
            .createQueryBuilder('sites')
            .where('CAST(sites.id AS TEXT) like :searchParam', { searchParam: `%${searchParam}%` })
            .orWhere('LOWER(sites.addr_line_1) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.addr_line_2) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.addr_line_3) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.addr_line_4) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.city) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.provState) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.postalCode) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })

        if (siteId) {
            query.andWhere('sites.id = :siteId', { siteId: siteId })
        }

        if (siteRemediationStatus) {
            query.andWhere('sites.srStatus = :siteRemediationStatus', { siteRemediationStatus: siteRemediationStatus })
        }

        if (siteRiskCode) {
            query.andWhere('sites.site_risk_code = :siteRiskCode', { siteRiskCode: siteRiskCode })
        }

        if (commonName) {
            query.andWhere('sites.common_name = :commonName', { commonName: commonName })
        }

        if (siteAddress) {
            const cleanedAddress = siteUtil.removeSpecialCharacters(siteAddress);// clean all special characters from address
            query.andWhere(`regexp_replace(concat_ws('', sites.addr_line_1, sites.addr_line_2, sites.addr_line_3, sites.addr_line_4), '[^a-zA-Z0-9]', '', 'g') LIKE :cleanedAddress`,
                { cleanedAddress: `%${cleanedAddress}%` })
        }

        if (city) {
            query.andWhere('sites.city = :city', { city: city })
        }

        if (createdBy) {
            query.andWhere('sites.who_created = :createdBy', { createdBy: createdBy })
        }

        if (latLongReliability) {
            query.andWhere('sites.latlong_reliability_flag = :latLongReliability', { latLongReliability: latLongReliability })
        }

        if (latDecimal) {
            query.andWhere('sites.latdeg = :latDecimal', { latDecimal: latDecimal })
        }

        if (latDeg) {
            query.andWhere('sites.lat_degrees = :latDeg', { latDeg: latDeg })
        }

        if (latMin) {
            query.andWhere('sites.lat_minutes = :latMin', { latMin: latMin })
        }

        if (latSec) {
            query.andWhere('sites.lat_seconds = :latSec', { latSec: latSec })
        }

        if (longDecimal) {
            query.andWhere('sites.longdeg = :longDecimal', { longDecimal: longDecimal })
        }

        if (longDeg) {
            query.andWhere('sites.long_degrees = :longDeg', { longDeg: longDeg })
        }

        if (longMin) {
            query.andWhere('sites.long_minutes = :longMin', { longMin: longMin })
        }

        if (longSec) {
            query.andWhere('sites.long_seconds = :longSec', { longSec: longSec })
        }

        if (dateCreated) {
            query.andWhere('sites.whenCreated = :dateCreated', { dateCreated: dateCreated })
        }

        if (lastUpdated) {
            query.andWhere('sites.whenUpdated = :lastUpdated', { lastUpdated: lastUpdated })
        }

        const result = await query.skip((page - 1) * pageSize).take(pageSize).getManyAndCount();

        response.sites = result[0] ? result[0] : [];
        response.count = result[1] ? result[1] : 0;
        response.page = page;
        response.pageSize = pageSize;

        return response;
    }

    /**
      * Find sites by its ID
     * @param siteId site Id
     * @returns a single site matching the site ID
     */
    async findSiteBySiteId(siteId: string) {
        const response = new FetchSiteDetail();

        response.httpStatusCode = 200;

        response.data = await this.siteRepository.findOneOrFail({ where: { id: siteId } });

        return response;
    }
}
