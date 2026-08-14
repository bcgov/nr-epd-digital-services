import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { LoggerService } from '../../logger/logger.service';
import { SiteService } from '../../services/site/site.service';
import { SiteDetailsResponse } from '../../dto/siteDetails.dto';
import { HttpStatus } from '@nestjs/common';

@Resolver()
export class SiteResolver {
  constructor(
    private readonly siteService: SiteService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => SiteDetailsResponse, {
    name: 'getSiteDetailsBySiteId',
  })
  async getSiteDetailsBySiteId(
    @Args('siteId', { type: () => String }) siteId: string,
  ) {
    this.loggerService.log('SiteResolver.getSiteDetailsBySiteId() start');

    try {
      const result = await this.siteService.getSiteById(siteId);

      if (result?.findSiteBySiteIdLoggedInUser?.data) {
        this.loggerService.log(
          'SiteResolver.getSiteDetailsBySiteId() RES:200 end',
        );
        return new SiteDetailsResponse(
          'Site details retrieved successfully',
          HttpStatus.OK,
          true,
          result.findSiteBySiteIdLoggedInUser?.data,
        );
      } else {
        this.loggerService.log(
          'SiteResolver.getSiteDetailsBySiteId() RES:404 end',
        );
        return new SiteDetailsResponse(
          'Site not found',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        'SiteResolver.getSiteDetailsBySiteId() error',
        error,
      );
      return new SiteDetailsResponse(
        'Error retrieving site details',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }

  @Query(() => SiteDetailsResponse, {
    name: 'getSiteByIdForService',
  })
  async getSiteByIdForService(
    @Args('siteId', { type: () => String }) siteId: string,
  ) {
    this.loggerService.log('SiteResolver.getSiteByIdForService() start');

    try {
      const result = await this.siteService.getSiteByIdForService(siteId);

      if (result?.findSiteBySiteIdForService?.data) {
        this.loggerService.log(
          'SiteResolver.getSiteByIdForService() RES:200 end',
        );
        return new SiteDetailsResponse(
          'Site details retrieved successfully',
          HttpStatus.OK,
          true,
          result.findSiteBySiteIdForService?.data,
        );
      } else {
        this.loggerService.log(
          'SiteResolver.getSiteByIdForService() RES:404 end',
        );
        return new SiteDetailsResponse(
          'Site not found',
          HttpStatus.NOT_FOUND,
          false,
          null,
        );
      }
    } catch (error) {
      this.loggerService.error(
        'SiteResolver.getSiteByIdForService() error',
        error,
      );
      return new SiteDetailsResponse(
        'Error retrieving site details',
        HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }

  @Query(() => SiteDetailsResponse, {
    name: 'getSiteByIdForServiceAsUser',
  })
  async getSiteByIdForServiceAsUser(
    @Args('siteId', { type: () => String }) siteId: string,
    @Context() context: { req?: { headers?: { authorization?: string } } },
  ) {
    this.loggerService.log('SiteResolver.getSiteByIdForServiceAsUser() start');

    try {
      const userToken = this.extractBearerToken(context);
      const result = await this.siteService.getSiteByIdForServiceWithUserToken(
        siteId,
        userToken,
      );
      const siteResult = result?.findSiteBySiteIdForService;

      if (siteResult?.data) {
        this.loggerService.log(
          'SiteResolver.getSiteByIdForServiceAsUser() RES:200 end',
        );
        return new SiteDetailsResponse(
          'Site details retrieved successfully',
          HttpStatus.OK,
          true,
          siteResult.data,
        );
      }

      // SITE's GraphQL exception filter turns 403 into a payload with data: null
      // instead of a thrown GraphQL error.
      if (this.isDeniedSitePayload(siteResult)) {
        this.loggerService.log(
          'SiteResolver.getSiteByIdForServiceAsUser() RES:403 end',
        );
        return new SiteDetailsResponse(
          siteResult?.message || 'Forbidden resource',
          siteResult?.httpStatusCode || HttpStatus.FORBIDDEN,
          false,
          null,
        );
      }

      this.loggerService.log(
        'SiteResolver.getSiteByIdForServiceAsUser() RES:404 end',
      );
      return new SiteDetailsResponse(
        siteResult?.message || 'Site not found',
        HttpStatus.NOT_FOUND,
        false,
        null,
      );
    } catch (error) {
      this.loggerService.error(
        'SiteResolver.getSiteByIdForServiceAsUser() error',
        error,
      );
      return new SiteDetailsResponse(
        this.extractErrorMessage(error),
        this.isForbiddenError(error)
          ? HttpStatus.FORBIDDEN
          : HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }

  private extractBearerToken(context: {
    req?: {
      headers?: { authorization?: string };
      accessTokenJWT?: string;
    };
  }): string {
    const header = context?.req?.headers?.authorization ?? '';
    if (header.startsWith('Bearer ')) {
      return header.slice(7);
    }
    if (header) {
      return header;
    }
    return context?.req?.accessTokenJWT ?? '';
  }

  private isDeniedSitePayload(siteResult?: {
    success?: boolean | null;
    httpStatusCode?: number | null;
    message?: string | null;
  }): boolean {
    if (!siteResult) {
      return false;
    }
    if (siteResult.httpStatusCode === HttpStatus.FORBIDDEN) {
      return true;
    }
    if (siteResult.success === false) {
      return this.isForbiddenError({ message: siteResult.message });
    }
    return false;
  }

  private isForbiddenError(error: unknown): boolean {
    const message = this.extractErrorMessage(error).toLowerCase();
    return (
      message.includes('forbidden') ||
      message.includes('403') ||
      message.includes('mismatched role')
    );
  }

  private extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
      const response = (
        error as {
          response?: { errors?: Array<{ message?: string }>; status?: number };
        }
      ).response;
      const graphqlMessage = response?.errors?.[0]?.message;
      if (graphqlMessage) {
        return graphqlMessage;
      }
      if (response?.status) {
        return `SITE request failed with HTTP ${response.status}`;
      }
    }
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return 'Error retrieving site details';
  }
}
