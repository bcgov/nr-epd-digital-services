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
    async searchSites(searchParam: string, page: number, pageSize: number, id?: string, srStatus?: string,
        siteRiskCode?: string, commonName?: string, addrLine_1?: string, city?: string, whoCreated?: string, latlongReliabilityFlag?: string,
        latdeg?: number, latDegrees?: number, latMinutes?: number, latSeconds?: string, longdeg?: number, longDegrees?: number, longMinutes?: number,
        longSeconds?: string, whenCreated?: Date, whenUpdated?: Date) {
        const siteUtil: SiteUtil = new SiteUtil();
        const response = new SearchSiteResponse();

        const query =  this.siteRepository
            .createQueryBuilder('sites')
            .where('CAST(sites.id AS TEXT) like :searchParam', { searchParam: `%${searchParam}%` })
            .orWhere('LOWER(sites.addr_line_1) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.addr_line_2) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.addr_line_3) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.addr_line_4) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.city) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.provState) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })
            .orWhere('LOWER(sites.postalCode) LIKE LOWER(:searchParam)', { searchParam: `%${searchParam.toLowerCase()}%` })

        if (id) {
            query.andWhere('sites.id = :id', { id: id })
        }

        if (srStatus) {
            query.andWhere('sites.srStatus = :srStatus', { srStatus: srStatus })
        }

        if (siteRiskCode) {
            query.andWhere('sites.site_risk_code = :siteRiskCode', { siteRiskCode: siteRiskCode })
        }

        if (commonName) {
            query.andWhere('sites.common_name = :commonName', { commonName: commonName })
        }

        if (addrLine_1) {
            const cleanedAddress = siteUtil.removeSpecialCharacters(addrLine_1);// clean all special characters from address
            query.andWhere(`regexp_replace(concat_ws('', sites.addr_line_1, sites.addr_line_2, sites.addr_line_3, sites.addr_line_4), '[^a-zA-Z0-9]', '', 'g') LIKE :cleanedAddress`,
                { cleanedAddress: `%${cleanedAddress}%` })
        }

        if (city) {
            query.andWhere('sites.city = :city', { city: city })
        }

        if (whoCreated) {
            query.andWhere('sites.who_created = :whoCreated', { whoCreated: whoCreated })
        }

        if (latlongReliabilityFlag) {
            query.andWhere('sites.latlong_reliability_flag = :latlongReliabilityFlag', { latlongReliabilityFlag: latlongReliabilityFlag })
        }

        if (latdeg) {
            query.andWhere('sites.latdeg = :latdeg', { latdeg: latdeg })
        }

        if (latDegrees) {
            query.andWhere('sites.lat_degrees = :latDegrees', { latDegrees: latDegrees })
        }

        if (latMinutes) {
            query.andWhere('sites.lat_minutes = :latMinutes', { latMinutes: latMinutes })
        }

        if (latSeconds) {
            query.andWhere('sites.lat_seconds = :latSeconds', { latSeconds: latSeconds })
        }

        if (longdeg) {
            query.andWhere('sites.longdeg = :longdeg', { longdeg: longdeg })
        }

        if (longDegrees) {
            query.andWhere('sites.long_degrees = :longDeg', { longDeg: longDegrees })
        }

        if (longMinutes) {
            query.andWhere('sites.long_minutes = :longMinutes', { longMinutes: longMinutes })
        }

        if (longSeconds) {
            query.andWhere('sites.long_seconds = :longSeconds', { longSeconds: longSeconds })
        }

        if (whenCreated) {
            query.andWhere('sites.whenCreated = :whenCreated', { whenCreated: whenCreated })
        }

        if (whenUpdated) {
            query.andWhere('sites.whenUpdated = :whenUpdated', { whenUpdated: whenUpdated })
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
