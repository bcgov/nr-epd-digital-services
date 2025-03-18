import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAppParticipantsDto } from './baseAppParticipants.dto';

@ObjectType()
export class ViewAppParticipantsDto extends BaseAppParticipantsDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;

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
}
