import { Injectable } from '@nestjs/common';

import { Sdk, getSdk } from './graphql/Site.generated';
import { LoggerService } from '../../logger/logger.service';

import { GraphQLClient } from 'graphql-request';

@Injectable()
export class SiteService {
  private readonly graphqlClient: GraphQLClient;
  private readonly siteSdk: Sdk;

  constructor(private readonly loggerService: LoggerService) {
    this.graphqlClient = new GraphQLClient(process.env.SITE_SERVICE_URL);
    this.siteSdk = getSdk(this.graphqlClient);
  }

  async getSiteById(siteId: string) {
    this.loggerService.log('SiteService.getSiteById() start');
    try {
      const siteData = await this.siteSdk.findSiteBySiteId({ siteId });
      this.loggerService.log('SiteService.getSiteById() end');
      return siteData;
    } catch (error) {
      this.loggerService.error(`Error in getSiteById: ${error.message}`, error);
      throw error;
    }
  }
}
