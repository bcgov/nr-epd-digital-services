import { Field, ObjectType } from '@nestjs/graphql';
import { People } from 'src/app/entities/people';

@ObjectType()
export class SearchPeopleResponse {
  @Field(() => [People])
  peoples: People[];

  @Field()
  count: number;

  @Field()
  page: number;

  @Field()
  pageSize: number;
}
