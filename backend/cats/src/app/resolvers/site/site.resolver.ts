import { Args, Query, Resolver } from '@nestjs/graphql';
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

      if (result?.findSiteBySiteId?.data) {
        this.loggerService.log(
          'SiteResolver.getSiteDetailsBySiteId() RES:200 end',
        );
        return new SiteDetailsResponse(
          'Site details retrieved successfully',
          HttpStatus.OK,
          true,
          result.findSiteBySiteId.data,
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
}
