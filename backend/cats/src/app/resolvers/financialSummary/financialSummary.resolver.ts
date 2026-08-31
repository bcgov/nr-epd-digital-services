import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import { FinancialSummaryService } from '../../services/financialSummary/financialSummary.service';
import {
  FinancialSummaryDto,
  FinancialSummaryResponse,
} from '../../dto/financialSummary/financialSummary.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { LoggerService } from '../../logger/logger.service';

@Resolver(() => FinancialSummaryDto)
export class FinancialSummaryResolver {
  constructor(
    private readonly financialSummaryService: FinancialSummaryService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => FinancialSummaryResponse, { name: 'getFinancialSummary' })
  async getFinancialSummary(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ): Promise<FinancialSummaryResponse> {
    const responseProvider = new GenericResponseProvider<FinancialSummaryDto>();
    this.loggerService.log(
      `FinancialSummaryResolver: getFinancialSummary: applicationId=${applicationId}`,
    );
    try {
      const summary = await this.financialSummaryService.getFinancialSummary(
        applicationId,
      );
      return responseProvider.createResponse(
        'Financial summary fetched successfully',
        HttpStatus.OK,
        true,
        summary,
      );
    } catch (error) {
      this.loggerService.error(
        `FinancialSummaryResolver: getFinancialSummary: Error: ${error.message}`,
        error.stack,
      );
      return responseProvider.createResponse(
        error.message || 'Failed to fetch financial summary',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      );
    }
  }
}
