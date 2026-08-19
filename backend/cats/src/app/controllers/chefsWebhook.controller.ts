import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service';
import { FormIntakeService } from '../services/formIntake/formIntake.service';
import { getAppTypeAbbrevByChefsFormId } from '../services/formIntake/formIntake.constants';
import { ChefsWebhookPayloadDto } from '../dto/formIntake.dto';

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
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'CHEFS submission webhook',
    description:
      'Called by the CHEFS Event Subscription feature when a form is submitted. Triggers processing of the submission if the formId is registered.',
  })
  @ApiResponse({ status: 200, description: 'Webhook received' })
  async handleChefsWebhook(@Body() payload: ChefsWebhookPayloadDto) {
    // We only care about the formId and submissionId from the webhook payload. Everything else is ignored.
    const { formId, submissionId } = payload;

    const appTypeAbbrev = getAppTypeAbbrevByChefsFormId(
      this.configService,
      formId,
    );

    if (!appTypeAbbrev) {
      this.loggerService.error(
        `CHEFS webhook received for unregistered formId ${formId}`,
        null,
      );
      return { received: true, processed: false };
    }

    try {
      await this.formIntakeService.fetchAndProcessSubmission(
        appTypeAbbrev,
        submissionId,
        'CHEFS_WEBHOOK',
      );
      return { received: true, processed: true };
    } catch (error: any) {
      this.loggerService.error(
        `Failed to process CHEFS webhook for submissionId ${submissionId}: ${error.message}`,
        null,
      );
      return { received: true, processed: false };
    }
  }
}
