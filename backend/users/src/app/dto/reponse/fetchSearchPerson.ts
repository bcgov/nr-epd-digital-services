import { Field, ObjectType } from '@nestjs/graphql';

import { Person } from 'src/app/entities/person.entity';

@ObjectType()
export class SearchPersonResponse {
  @Field(() => [Person])
  persons: Person[];

  @Field()
  count: number;

  @Field()
  page: number;

  @Field()
  pageSize: number;
}
