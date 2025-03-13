import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ApplicationSearchService } from '../../services/application/applicationSearch.service';
import {
  ApplicationSearchResponse,
  ApplicationSearchResult,
} from '../../dto/response/applicationSearchResponse';
import { ApplicationFilter } from '../../utilities/enums/applicationFilter.enum';
import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';

@Resolver()
export class ApplicationSearchResolver {
  constructor(
    private readonly applicationSearchService: ApplicationSearchService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => ApplicationSearchResponse)
  async searchApplications(
    @Args('searchParam') searchParam: string,
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'pageSize', type: () => Int }) pageSize: number,
    @Args({ name: 'filter', type: () => ApplicationFilter })
    filter: ApplicationFilter,
  ): Promise<ApplicationSearchResponse> {
    this.loggerService.log(
      `ApplicationSearchResolver: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}.`,
    );
    const result: ApplicationSearchResult =
      await this.applicationSearchService.searchApplications(
        searchParam,
        page,
        pageSize,
        filter,
      );
    if (!result || result.error) {
      this.loggerService.error(
        `ApplicationSearchResolver: searchApplications: ${result.error}.`,
        null,
      );
      return {
        message: result.error,
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        timestamp: new Date().toISOString(),
        count: 0,
        page: 0,
        pageSize: 0,
      } as ApplicationSearchResponse;
    } else {
      this.loggerService.log(
        `ApplicationSearchResolver: ${result.count} applications found.`,
      );
      return {
        applications: result.applications,
        message: '',
        httpStatusCode: HttpStatus.OK,
        success: true,
        timestamp: new Date().toISOString(),
        count: result.count,
        page: result.page,
        pageSize: result.pageSize,
      } as ApplicationSearchResponse;
    }
  }
}
