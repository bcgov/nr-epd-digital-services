import { Field, ObjectType } from '@nestjs/graphql';
import { Person } from '../entities/person.entity';
import { ViewPerson } from './person/viewPerson.dto';

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

  @Field(() => [ViewPerson])
  staffAssigned: ViewPerson[];

  @Field()
  priority: string;

  @Field()
  url: string;
}
