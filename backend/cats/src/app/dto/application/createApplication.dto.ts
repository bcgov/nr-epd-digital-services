import { ApplicationStatusDto } from './applicationStatus.dto';
import { IsOptional } from 'class-validator';

export class CreateApplication {
  siteIds: number[]; // multiple sites for which the application is created

  appTypeAbbrev: string; // the application type eg: SDS, SoSC etc

  receivedDate: Date; // date when application was submitted in SRS

  applicationStatus: ApplicationStatusDto[];

  @IsOptional()
  applicationSpecificData?: string; // JSON string for application-specific fields
}
