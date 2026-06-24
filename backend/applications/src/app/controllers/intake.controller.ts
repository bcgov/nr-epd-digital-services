import {
  Body,
  Controller,
  Get,
  Headers,
  Logger,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Unprotected } from 'nest-keycloak-connect';
import { ChefsWebhookDto } from '../dto/chefs-webhook.dto';
import {
  IntakeChefsSubmitDto,
  IntakeDirectSubmitDto,
  IntakeStatusUpdateDto,
} from '../dto/intake-submit.dto';
import { IntakeService } from '../services/intake.service';

/**
 * Intake endpoints — prototype bridge from CHEFS (or direct POST) to CATS.
 * Does not require Origin header (unlike legacy FormsFlow custom submission path).
 */
@ApiTags('intake')
@Controller('intake')
@Unprotected()
export class IntakeController {
  private readonly logger = new Logger(IntakeController.name);

  constructor(private readonly intakeService: IntakeService) {}

  private validateChefsWebhookAuth(headers: Record<string, string>): void {
    const keyName = process.env.CHEFS_WEBHOOK_KEY;
    const expectedToken = process.env.CHEFS_WEBHOOK_TOKEN;

    if (!keyName || !expectedToken) {
      this.logger.warn(
        'CHEFS webhook auth not configured (CHEFS_WEBHOOK_KEY / CHEFS_WEBHOOK_TOKEN) — accepting request',
      );
      return;
    }

    const received =
      headers[keyName.toLowerCase()] ?? headers[keyName] ?? '';
    if (received !== expectedToken) {
      throw new UnauthorizedException('Invalid CHEFS webhook credentials');
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Intake adapter health' })
  health() {
    return {
      status: 'ok',
      catsIntegrationEnabled: this.intakeService.isCatsIntegrationEnabled(),
      catsApi: process.env.CATS_API ?? null,
      chefsApiUrl:
        process.env.CHEFS_API_URL ??
        'https://submit.digital.gov.bc.ca/app/api/v1',
    };
  }

  @Post('submit')
  @ApiOperation({
    summary: 'Direct intake submit (prototype / demo without CHEFS)',
    description:
      'Saves submission to Postgres and creates a CATS application when CATS_INTEGRATION_ENABLED=true.',
  })
  @ApiBody({ type: IntakeDirectSubmitDto })
  @ApiResponse({ status: 201, description: 'Submission ingested' })
  async directSubmit(@Body() body: IntakeDirectSubmitDto) {
    return this.intakeService.submitToIntake(body.formId, body.data);
  }

  @Post('chefs/submit')
  @ApiOperation({
    summary: 'Ingest a CHEFS submission into CATS',
    description:
      'Fetches submission from CHEFS API using form API key, mirrors locally, creates CATS application.',
  })
  @ApiBody({ type: IntakeChefsSubmitDto })
  async chefsSubmit(@Body() body: IntakeChefsSubmitDto) {
    const apiKey = this.intakeService.resolveChefsApiKey(body.apiKey);
    return this.intakeService.submitFromChefs(
      body.chefsFormId,
      body.chefsSubmissionId,
      apiKey,
    );
  }

  @Get('chefs/forms/:formId/schema')
  @ApiOperation({
    summary: 'Published CHEFS form schema (Form.io JSON) for CATS Application tab',
    description:
      'Proxies CHEFS GET /forms/{formId}/version using server-side CHEFS_NOM_API_KEY. Used when formId is a CHEFS UUID instead of FormsFlow.',
  })
  async getChefsFormSchema(@Param('formId') formId: string) {
    return this.intakeService.getChefsFormSchema(formId);
  }

  @Get('chefs/submissions')
  @ApiOperation({
    summary: 'List recent CHEFS submissions for the NOM pilot form',
    description:
      'Uses CHEFS export API and server-side CHEFS_NOM_API_KEY. Powers the /forms prototype UI.',
  })
  async listChefsSubmissions() {
    return this.intakeService.listNomChefsSubmissions(10);
  }

  @Post('chefs/submit-latest')
  @ApiOperation({
    summary: 'Ingest the most recent CHEFS NOM submission into CATS',
    description:
      'Lists submissions from CHEFS, ingests the newest. One-click demo after submitting in CHEFS.',
  })
  async ingestLatestChefsSubmission() {
    return this.intakeService.ingestLatestChefsSubmission();
  }

  @Post('chefs/webhook')
  @ApiOperation({
    summary: 'CHEFS Event Subscription webhook (NOM pilot)',
    description:
      'CHEFS POSTs submission metadata here on form submit. Adapter fetches full submission, mirrors locally, and creates a CATS application. Configure in CHEFS form settings → Event Subscription.',
  })
  @ApiBody({ type: ChefsWebhookDto })
  @ApiHeader({
    name: 'CHEFS_WEBHOOK_KEY',
    description:
      'Header name matches CHEFS_WEBHOOK_KEY env (the Key value configured in CHEFS form settings)',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Submission ingested or event ignored' })
  @ApiResponse({ status: 401, description: 'Invalid webhook credentials' })
  async chefsWebhook(
    @Body() body: ChefsWebhookDto,
    @Headers() headers: Record<string, string>,
  ) {
    this.validateChefsWebhookAuth(headers);
    return this.intakeService.handleChefsWebhook(body);
  }

  @Post('status')
  @ApiOperation({
    summary: 'Update CATS application status for a submission',
    description: 'Prototype review action — maps to CATS updateFormsflowAppId mutation.',
  })
  @ApiBody({ type: IntakeStatusUpdateDto })
  async updateStatus(@Body() body: IntakeStatusUpdateDto) {
    return this.intakeService.updateStatus(
      body.formId,
      body.submissionId,
      body.statusTypeAbbrev,
      body.formsflowAppId ?? 0,
    );
  }
}
