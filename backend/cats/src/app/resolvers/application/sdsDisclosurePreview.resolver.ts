import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { SdsDisclosurePreviewService } from '../../services/application/sdsDisclosurePreview.service';
import {
  SdsDisclosurePreviewDto,
  SdsDisclosurePreviewResponse,
} from '../../dto/application/sdsDisclosurePreview.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';

@Resolver()
export class SdsDisclosurePreviewResolver {
  constructor(
    private readonly sdsDisclosurePreviewService: SdsDisclosurePreviewService,
    private readonly loggerService: LoggerService,
    private readonly responseProvider: GenericResponseProvider<SdsDisclosurePreviewDto>,
  ) {}

  @Query(() => SdsDisclosurePreviewResponse, {
    name: 'getSdsDisclosurePreview',
  })
  async getSdsDisclosurePreview(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ): Promise<SdsDisclosurePreviewResponse> {
    this.loggerService.log(
      'SdsDisclosurePreviewResolver.getSdsDisclosurePreview() start',
    );

    try {
      const result =
        await this.sdsDisclosurePreviewService.getSdsDisclosurePreview(
          applicationId,
        );

      this.loggerService.log(
        'SdsDisclosurePreviewResolver.getSdsDisclosurePreview() RES:200 end',
      );

      return this.responseProvider.createResponse(
        'Site disclosure preview retrieved successfully',
        HttpStatus.OK,
        true,
        result,
      ) as SdsDisclosurePreviewResponse;
    } catch (error) {
      this.loggerService.error(
        'SdsDisclosurePreviewResolver.getSdsDisclosurePreview() error',
        error,
      );

      return this.responseProvider.createResponse(
        error.message || 'Failed to retrieve site disclosure preview',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      ) as SdsDisclosurePreviewResponse;
    }
  }
}
