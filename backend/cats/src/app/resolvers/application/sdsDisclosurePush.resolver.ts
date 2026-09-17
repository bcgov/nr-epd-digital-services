import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { LoggerService } from '../../logger/logger.service';
import { SdsDisclosurePushService } from '../../services/application/sdsDisclosurePush.service';
import {
  PushedSiteDisclosureDto,
  PushSiteDisclosureResponse,
} from '../../dto/application/sdsDisclosurePush.dto';

@Resolver()
export class SdsDisclosurePushResolver {
  constructor(
    private readonly sdsDisclosurePushService: SdsDisclosurePushService,
    private readonly loggerService: LoggerService,
  ) {}

  @Mutation(() => PushSiteDisclosureResponse, {
    name: 'pushSiteDisclosure',
  })
  async pushSiteDisclosure(
    @Args('applicationId', { type: () => Int }) applicationId: number,
    @AuthenticatedUser() user: any,
  ): Promise<PushSiteDisclosureResponse> {
    this.loggerService.log(
      'SdsDisclosurePushResolver.pushSiteDisclosure() start',
    );

    try {
      const result = await this.sdsDisclosurePushService.pushSiteDisclosure(
        applicationId,
        user,
      );

      this.loggerService.log(
        'SdsDisclosurePushResolver.pushSiteDisclosure() RES:200 end',
      );

      return this.buildResponse(
        'Site disclosure pushed to Site Registry',
        HttpStatus.OK,
        true,
        result,
        null,
      );
    } catch (error) {
      this.loggerService.error(
        'SdsDisclosurePushResolver.pushSiteDisclosure() error',
        error,
      );

      return this.buildResponse(
        error.message || 'Failed to push the disclosure to Site Registry',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        false,
        null,
        error.errorCode ?? null,
      );
    }
  }

  private buildResponse(
    message: string,
    httpStatusCode: number,
    success: boolean,
    data: PushedSiteDisclosureDto | null,
    errorCode: string | null,
  ): PushSiteDisclosureResponse {
    const response = new PushSiteDisclosureResponse();
    response.message = message;
    response.httpStatusCode = httpStatusCode;
    response.success = success;
    response.data = data;
    response.errorCode = errorCode;
    return response;
  }
}
