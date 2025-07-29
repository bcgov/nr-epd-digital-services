import { Injectable, OnModuleInit } from '@nestjs/common';
import { GraphQLClient } from 'graphql-request';
import axios from 'axios';

import { Sdk, getSdk } from './graphql/Site.generated';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class SiteService implements OnModuleInit {
  private graphqlClient: GraphQLClient;
  private siteSdk: Sdk;

  private accessToken: string;
  private tokenExpiry: number; // in UNIX timestamp seconds

  constructor(private readonly loggerService: LoggerService) {}

  onModuleInit() {
    this.validateEnv();
  }

  private validateEnv() {
    const requiredVars = [
      'KEYCLOAK_TOKEN_URL',
      'KEYCLOAK_SITE_SERVICE_CLIENT_ID',
      'KEYCLOAK_SITE_SERVICE_CLIENT_SECRET',
      'SITE_SERVICE_URL',
    ];

    for (const key of requiredVars) {
      if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
      }
    }
  }

  private async getAccessToken(): Promise<string> {
    const now = Math.floor(Date.now() / 1000);

    if (this.accessToken && this.tokenExpiry && now < this.tokenExpiry - 60) {
      return this.accessToken;
    }

    const keycloakUrl = process.env.KEYCLOAK_TOKEN_URL;

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

      this.accessToken = response.data.access_token;
      this.tokenExpiry = now + response.data.expires_in;

      return this.accessToken;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        this.loggerService.error(
          `Keycloak token error: ${error.message}`,
          error.toString(),
        );
      } else {
        this.loggerService.error(
          `Unexpected token fetch error`,
          error.toString(),
        );
      }
      throw new Error('Failed to retrieve access token');
    }
  }

  private async getSiteSdk(): Promise<Sdk> {
    const token = await this.getAccessToken();
    this.graphqlClient = new GraphQLClient(process.env.SITE_SERVICE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return getSdk(this.graphqlClient);
  }

  async getSiteById(siteId: string) {
    this.loggerService.log('SiteService.getSiteById() start');

    try {
      this.siteSdk = await this.getSiteSdk();
      const siteData = await this.siteSdk.findSiteBySiteIdLoggedInUser({
        siteId,
      });
      console.log('SiteService.siteData', JSON.stringify(siteData));
      this.loggerService.log('SiteService.getSiteById() end');
      return siteData;
    } catch (error: unknown) {
      this.loggerService.error(
        `Error in getSiteById: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error.toString(),
      );
      throw error;
    }
  }
}
