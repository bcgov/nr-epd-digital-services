import { Field, ObjectType } from '@nestjs/graphql';
import { ViewPerson } from '../person/viewPerson.dto';

@ObjectType()
export class SearchPersonResponse {
  @Field(() => [ViewPerson])
  persons: ViewPerson[];

  @Field()
  count: number;

  @Field()
  page: number;

  @Field()
  pageSize: number;
}
