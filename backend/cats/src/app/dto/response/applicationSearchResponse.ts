import { Field, ObjectType } from '@nestjs/graphql';
import { ApplicationResultDto } from '../applicationResultDto';
import { PagedResponseDto } from './response.dto';

export class ApplicationSearchResult {
  applications: ApplicationResultDto[];
  count: number;
  page: number;
  pageSize: number;
  error?: string;
}

@ObjectType()
export class ApplicationSearchResponse extends PagedResponseDto {
  @Field(() => [ApplicationResultDto])
  applications: ApplicationResultDto[];
}
