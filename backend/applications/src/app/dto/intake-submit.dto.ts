import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IntakeDirectSubmitDto {
  @ApiProperty({ example: 'sir-chefs-form-id' })
  formId: string;

  @ApiProperty({
    description: 'Form field values (must include hdnAppType and site ID fields)',
    example: {
      hdnAppType: 'IR',
      siteSpecificSiteId: '100001',
      applicationId: 0,
    },
  })
  data: Record<string, unknown>;
}

export class IntakeChefsSubmitDto {
  @ApiProperty({ description: 'CHEFS form UUID (from form URL ?f=...)' })
  chefsFormId: string;

  @ApiProperty({ description: 'CHEFS submission UUID after user submits the form' })
  chefsSubmissionId: string;

  @ApiPropertyOptional({
    description:
      'CHEFS form API key. Optional when CHEFS_NOM_API_KEY is set on the intake adapter.',
  })
  apiKey?: string;
}

export class IntakeStatusUpdateDto {
  @ApiProperty()
  formId: string;

  @ApiProperty()
  submissionId: string;

  @ApiProperty({ example: 'In Review', description: 'CATS status_type.abbrev' })
  statusTypeAbbrev: string;

  @ApiPropertyOptional({ example: 0 })
  formsflowAppId?: number;
}
