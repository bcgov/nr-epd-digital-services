import {
  Body,
  Controller,
  Headers,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { timingSafeEqual } from 'crypto';
import { Unprotected } from 'nest-keycloak-connect';
import { ChefsWebhookPayloadDto } from '../dto/formIntake.dto';
import { LoggerService } from '../logger/logger.service';
import { getAppTypeAbbrevByChefsFormId } from '../services/formIntake/formIntake.constants';
import { FormIntakeService } from '../services/formIntake/formIntake.service';

@ApiTags('cats')
@Controller('cats/webhooks/chefs')
@Unprotected()
export class ChefsWebhookController {
  constructor(
    private readonly formIntakeService: FormIntakeService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @ApiOperation({
    summary: 'CHEFS submission webhook',
    description:
      'Receives CHEFS Event Subscription submission events and processes the referenced submission.',
  })
  @ApiHeader({
    name: 'X-Endpoint-Token',
    required: true,
    description: 'CHEFS Event Subscription endpoint token',
  })
  @ApiResponse({ status: 200, description: 'Submission processed' })
  @ApiResponse({ status: 400, description: 'Invalid event payload' })
  @ApiResponse({ status: 401, description: 'Invalid endpoint token' })
  @ApiResponse({ status: 404, description: 'Unregistered CHEFS form' })
  @ApiResponse({ status: 500, description: 'Submission processing failed' })
  async handleChefsWebhook(
    @Body() payload: ChefsWebhookPayloadDto,
    @Headers('x-endpoint-token') endpointToken: string | undefined,
  ) {
    this.validateEndpointToken(endpointToken);

    const appTypeAbbrev = getAppTypeAbbrevByChefsFormId(
      this.configService,
      payload.formId,
    );
    if (!appTypeAbbrev) {
      this.loggerService.error(
        `CHEFS webhook received for unregistered formId ${payload.formId}`,
        null,
      );
      throw new NotFoundException('CHEFS form is not registered for intake');
    }

    try {
      const submission = await this.formIntakeService.fetchAndProcessSubmission(
        appTypeAbbrev,
        payload.submissionId,
        'CHEFS_WEBHOOK',
      );
      return { received: true, processed: submission !== null };
    } catch (error: any) {
      this.loggerService.error(
        `Failed to process CHEFS webhook for submissionId ${payload.submissionId}: ${error.message}`,
        null,
      );
      throw new InternalServerErrorException(
        'Failed to process CHEFS submission',
      );
    }
  }

  private validateEndpointToken(receivedToken: string | undefined) {
    const expectedToken = this.configService.get<string>(
      'CHEFS_EVENT_SUBSCRIPTION_TOKEN',
    );
    if (!expectedToken) {
      this.loggerService.error(
        'CHEFS_EVENT_SUBSCRIPTION_TOKEN is not configured',
        null,
      );
      throw new InternalServerErrorException('Webhook token is not configured');
    }

    const expectedBuffer = Buffer.from(expectedToken);
    const receivedBuffer = Buffer.from(receivedToken ?? '');
    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      throw new UnauthorizedException('Invalid endpoint token');
    }
  }
}
