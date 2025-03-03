import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from '../entities/person.entity';

@ObjectType()
export class ApplicationResultDto {
  @Field()
  id: string;

  @Field()
  siteId: string;

  @Field()
  siteAddress: string;

  @Field()
  applicationType: string;

  @Field()
  lastUpdated: string;

  @Field()
  status: string;

  @Field(() => [Person])
  staffAssigned: Person[];

  @Field()
  priority: string;

  @Field()
  url: string;
}
