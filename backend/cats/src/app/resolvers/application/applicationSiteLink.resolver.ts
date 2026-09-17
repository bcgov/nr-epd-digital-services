import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { LoggerService } from '../../logger/logger.service';
import { ApplicationSiteLinkService } from '../../services/application/applicationSiteLink.service';
import {
  LinkApplicationSiteIdResponse,
  LinkedApplicationSiteDto,
} from '../../dto/application/linkApplicationSiteId.dto';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';

@Resolver()
export class ApplicationSiteLinkResolver {
  constructor(
    private readonly applicationSiteLinkService: ApplicationSiteLinkService,
    private readonly loggerService: LoggerService,
    private readonly responseProvider: GenericResponseProvider<LinkedApplicationSiteDto>,
  ) {}

  @Mutation(() => LinkApplicationSiteIdResponse, {
    name: 'linkApplicationSiteId',
  })
  async linkApplicationSiteId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @Args('siteId', { type: () => String, nullable: true })
    siteId: string | null,
    @AuthenticatedUser() user: any,
  ): Promise<LinkApplicationSiteIdResponse> {
    this.loggerService.log(
      'ApplicationSiteLinkResolver.linkApplicationSiteId() start',
    );

    try {
      const result =
        await this.applicationSiteLinkService.linkApplicationSiteId(
          applicationId,
          siteId,
          user,
        );

      this.loggerService.log(
        'ApplicationSiteLinkResolver.linkApplicationSiteId() RES:200 end',
      );

      return this.responseProvider.createResponse(
        result.siteId == null
          ? 'Site ID unlinked successfully'
          : 'Site ID linked successfully',
        HttpStatus.OK,
        true,
        result,
      ) as LinkApplicationSiteIdResponse;
    } catch (error) {
      this.loggerService.error(
        'ApplicationSiteLinkResolver.linkApplicationSiteId() error',
        error,
      );

      return this.responseProvider.createResponse(
        error.message || 'Failed to link Site ID',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
      ) as LinkApplicationSiteIdResponse;
    }
  }
}
