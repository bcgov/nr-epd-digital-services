import { Injectable } from '@nestjs/common';

import { Sdk, getSdk } from './graphql/Site.generated';
import { LoggerService } from '../../logger/logger.service';

import { GraphQLClient } from 'graphql-request';
import axios from 'axios';

@Injectable()
export class SiteService {
  private graphqlClient: GraphQLClient;
  private siteSdk: Sdk;

  private async getAccessToken(): Promise<string> {
    const keycloakUrl = process.env.KEYCLOAK_TOKEN_URL; // e.g., https://keycloak/realms/<realm>/protocol/openid-connect/token

    const payload = new URLSearchParams();
    payload.append('client_id', process.env.KEYCLOAK_SITE_SERVICE_CLIENT_ID);
    payload.append(
      'client_secret',
      process.env.KEYCLOAK_SITE_SERVICE_CLIENT_SECRET,
    );
    payload.append('grant_type', 'client_credentials');

    try {
      const response = await axios.post(keycloakUrl, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return response.data.access_token;
    } catch (error) {
      this.loggerService.error(
        `Failed to get Keycloak token: ${error.message}`,
        error,
      );
      throw new Error('Authentication failed');
    }
  }

  private async initGraphQLClient(): Promise<void> {
    const token = await this.getAccessToken();
    this.graphqlClient = new GraphQLClient(process.env.SITE_SERVICE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.siteSdk = getSdk(this.graphqlClient);
  }

  constructor(private readonly loggerService: LoggerService) {}

  async getSiteById(siteId: string) {
    this.loggerService.log('SiteService.getSiteById() start');
    try {
      if (!this.siteSdk) {
        await this.initGraphQLClient();
      }

      const siteData = await this.siteSdk.findSiteBySiteIdLoggedInUser({
        siteId,
      });
      this.loggerService.log('SiteService.getSiteById() end');
      return siteData;
    } catch (error) {
      this.loggerService.error(`Error in getSiteById: ${error.message}`, error);
      throw error;
    }
  }
}
