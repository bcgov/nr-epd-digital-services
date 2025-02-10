import { ObjectType, Field } from '@nestjs/graphql';
import { BasePerson } from './basePerson.dto';

@ObjectType()
export class ViewPerson extends BasePerson {
  @Field()
  id: number;

  @Field()
  rowVersionCount: number | null;

  @Field()
  createdBy: string;

  @Field()
  createdDatetime: Date;

  @Field({ nullable: true })
  updatedBy: string | null;

  @Field({ nullable: true })
  updatedDatetime: Date | null;

//   @Field({ nullable: true })
//   ts: Buffer | null;
}
