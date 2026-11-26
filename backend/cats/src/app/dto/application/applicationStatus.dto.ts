export class ApplicationStatusDto {
  id?: number;

  applicationId: number;

  statusTypeAbbrev: string;

  isCurrent: boolean;

  formId: string; // CHEFS form id

  submissionId: string; // CHEFS submission id
}
