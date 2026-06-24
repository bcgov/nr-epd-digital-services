import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Payload CHEFS Event Subscription POSTs to the adapter webhook.
 * @see https://developer.gov.bc.ca/docs/default/component/chefs-techdocs/Capabilities/Integrations/Event-Subscription/
 */
export class ChefsWebhookDto {
  @ApiProperty({ description: 'CHEFS form UUID' })
  formId: string;

  @ApiProperty({ description: 'CHEFS form version UUID' })
  formVersion: string;

  @ApiProperty({
    description: 'Event type',
    example: 'eventSubmission',
  })
  subscriptionEvent: string;

  @ApiPropertyOptional({
    description: 'CHEFS submission UUID (present for submission events)',
  })
  submissionId?: string;
}
