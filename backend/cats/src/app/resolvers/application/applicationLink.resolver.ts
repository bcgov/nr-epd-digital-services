import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { ApplicationLinkService } from '../../services/applicationLink/applicationLink.service';
import {
  ApplicationLinkDto,
  ApplicationLinksResponse,
} from '../../dto/applicationLink.dto';

@Resolver(() => ApplicationLinkDto)
export class ApplicationLinkResolver {
  constructor(
    private readonly applicationLinkService: ApplicationLinkService,
    private readonly genericResponseProvider: GenericResponseProvider<
      ApplicationLinkDto[]
    >,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => ApplicationLinksResponse, { name: 'getApplicationLinks' })
  @UsePipes(new GenericValidationPipe())
  async getApplicationLinks(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ) {
    this.loggerService.log(
      `ApplicationLinkResolver.getApplicationLinks: Getting links for application ID ${applicationId}`,
    );

    const result = await this.applicationLinkService.listForCssa(applicationId);

    return this.genericResponseProvider.createResponse(
      'Application links fetched successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }
}
