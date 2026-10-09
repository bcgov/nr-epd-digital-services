import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { LoggerService } from '../../logger/logger.service';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { ApplicationLinkService } from '../../services/applicationLink/applicationLink.service';
import {
  ApplicationLinkDto,
  ApplicationLinkSearchHitDto,
  ApplicationLinkSearchResponse,
  ApplicationLinksResponse,
  SaveApplicationLinksInput,
} from '../../dto/applicationLink.dto';

@Resolver(() => ApplicationLinkDto)
export class ApplicationLinkResolver {
  constructor(
    private readonly applicationLinkService: ApplicationLinkService,
    private readonly genericResponseProvider: GenericResponseProvider<
      ApplicationLinkDto[]
    >,
    private readonly searchResponseProvider: GenericResponseProvider<
      ApplicationLinkSearchHitDto[]
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

  @Query(() => ApplicationLinkSearchResponse, {
    name: 'searchApplicationLinkTargets',
  })
  @UsePipes(new GenericValidationPipe())
  async searchApplicationLinkTargets(
    @Args('cssaApplicationId', { type: () => Int }) cssaApplicationId: number,
    @Args('query') query: string,
    @Args('excludeApplicationIds', { type: () => [Int] })
    excludeApplicationIds: number[],
  ) {
    this.loggerService.log(
      `ApplicationLinkResolver.searchApplicationLinkTargets: Searching links for application ID ${cssaApplicationId}`,
    );

    const result = await this.applicationLinkService.searchLinkTargets(
      cssaApplicationId,
      query,
      excludeApplicationIds,
    );

    return this.searchResponseProvider.createResponse(
      'Application link targets fetched successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }

  @Mutation(() => ApplicationLinksResponse, { name: 'saveApplicationLinks' })
  @UsePipes(new GenericValidationPipe())
  async saveApplicationLinks(
    @Args('input') input: SaveApplicationLinksInput,
    @AuthenticatedUser() user: any,
  ) {
    this.loggerService.log(
      `ApplicationLinkResolver.saveApplicationLinks: Saving links for application ID ${input.cssaApplicationId}`,
    );

    await this.applicationLinkService.saveStaffLinks(
      input.cssaApplicationId,
      input.links.map((link) => ({
        targetApplicationId: link.targetApplicationId ?? null,
        confirmationId: link.confirmationId ?? null,
      })),
      typeof user?.name === 'string' ? user.name : 'SYSTEM',
    );

    const result = await this.applicationLinkService.listForCssa(
      input.cssaApplicationId,
    );

    return this.genericResponseProvider.createResponse(
      'Application links saved successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }
}
