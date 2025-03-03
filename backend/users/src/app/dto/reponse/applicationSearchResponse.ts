import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ApplicationResultDto } from '../applicationResultDto';

@ObjectType()
export class ApplicationSearchResponse {
  @Field(() => [ApplicationResultDto])
  applications: ApplicationResultDto[];

  @Field(() => Int)
  count: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;
}
