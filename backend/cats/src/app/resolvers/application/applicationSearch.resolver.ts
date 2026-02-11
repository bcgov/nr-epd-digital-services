import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ApplicationSearchService } from '../../services/application/applicationSearch.service';
import {
  ApplicationSearchResponse,
  ApplicationSearchResult,
} from '../../dto/response/applicationSearchResponse';
import { Filter } from '../../utilities/enums/application/filter.enum';
import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { SortByDirection } from '../../utilities/enums/application/sortByDirection.enum';
import { SortByField } from '../../utilities/enums/application/sortByField.enum';
import { AuthenticatedUser } from 'nest-keycloak-connect';

@Resolver()
export class ApplicationSearchResolver {
  constructor(
    private readonly applicationSearchService: ApplicationSearchService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => ApplicationSearchResponse)
  async searchApplications(
    @AuthenticatedUser() user: any,
    @Args('searchParam') searchParam: string,
    @Args({ name: 'page', type: () => Int }) page: number,
    @Args({ name: 'pageSize', type: () => Int }) pageSize: number,
    @Args({ name: 'filter', type: () => Filter })
    filter: Filter,
    @Args({ name: 'sortBy', type: () => SortByField, nullable: true })
    sortBy?: SortByField,
    @Args({ name: 'sortByDir', type: () => SortByDirection, nullable: true })
    sortByDir?: SortByDirection,
    // Filter parameters
    @Args({ name: 'filterId', nullable: true }) filterId?: string,
    @Args({ name: 'filterServiceType', nullable: true })
    filterServiceType?: string,
    @Args({ name: 'filterCommonName', nullable: true })
    filterCommonName?: string,
    @Args({ name: 'filterCsapReference', nullable: true })
    filterCsapReference?: string,
    @Args({ name: 'filterSiteId', nullable: true }) filterSiteId?: string,
    @Args({ name: 'filterSiteRiskClassification', nullable: true })
    filterSiteRiskClassification?: string,
    @Args({ name: 'filterSiteAddress', nullable: true })
    filterSiteAddress?: string,
    @Args({ name: 'filterApplicationType', nullable: true })
    filterApplicationType?: string,
    @Args({ name: 'filterStatus', nullable: true }) filterStatus?: string,
    @Args({ name: 'filterStaffAssigned', nullable: true })
    filterStaffAssigned?: string,
    @Args({ name: 'filterPriority', nullable: true }) filterPriority?: string,
    @Args({ name: 'filterDateReceivedFrom', nullable: true })
    filterDateReceivedFrom?: Date,
    @Args({ name: 'filterDateReceivedTo', nullable: true })
    filterDateReceivedTo?: Date,
    @Args({ name: 'filterLastUpdatedFrom', nullable: true })
    filterLastUpdatedFrom?: Date,
    @Args({ name: 'filterLastUpdatedTo', nullable: true })
    filterLastUpdatedTo?: Date,
    @Args({ name: 'filterDateCompletedFrom', nullable: true })
    filterDateCompletedFrom?: Date,
    @Args({ name: 'filterDateCompletedTo', nullable: true })
    filterDateCompletedTo?: Date,
    @Args({ name: 'filterInvoiceStatus', nullable: true })
    filterInvoiceStatus?: string,
  ): Promise<ApplicationSearchResponse> {
    console.log(user);
    this.loggerService.log(
      `ApplicationSearchResolver: searchParam: ${searchParam}, page: ${page}, pageSize: ${pageSize}, filter: ${filter}, sortBy: ${sortBy}, sortByDir: ${sortByDir}.`,
    );

    const filters = {
      id: filterId,
      serviceType: filterServiceType,
      commonName: filterCommonName,
      csapReference: filterCsapReference,
      siteId: filterSiteId,
      siteRiskClassification: filterSiteRiskClassification,
      siteAddress: filterSiteAddress,
      applicationType: filterApplicationType,
      status: filterStatus,
      staffAssigned: filterStaffAssigned,
      priority: filterPriority,
      dateReceivedFrom: filterDateReceivedFrom,
      dateReceivedTo: filterDateReceivedTo,
      lastUpdatedFrom: filterLastUpdatedFrom,
      lastUpdatedTo: filterLastUpdatedTo,
      dateCompletedFrom: filterDateCompletedFrom,
      dateCompletedTo: filterDateCompletedTo,
      invoiceStatus: filterInvoiceStatus,
    };

    const result: ApplicationSearchResult =
      await this.applicationSearchService.searchApplications(
        searchParam,
        page,
        pageSize,
        filter,
        filters,
        sortBy,
        sortByDir,
        user,
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

  @Query(() => ApplicationSearchResponse)
  async searchApplicationsById(
    @Args('query') query: string,
  ): Promise<ApplicationSearchResponse> {
    this.loggerService.log(
      `ApplicationSearchResolver.searchApplicationsById: ${query}.`,
    );
    const result: ApplicationSearchResult =
      await this.applicationSearchService.searchApplicationsById(query);

    if (!result || result.error) {
      this.loggerService.error(
        `ApplicationSearchResolver.searchApplicationsById: ${result.error}.`,
        null,
      );
    }

    this.loggerService.log(
      `ApplicationSearchResolver.searchApplicationsById: ${result.applications.length} applications found.`,
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
