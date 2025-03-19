import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAppParticipantsDto } from './baseAppParticipants.dto';

@ObjectType()
export class ViewAppParticipantsDto extends BaseAppParticipantsDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;

  @Field({ nullable: true })
  rowVersionCount: number | null;

  @Field()
  createdBy: string;

  @Field()
  createdDateTime: Date;

  @Field({ nullable: true })
  updatedBy: string | null;

  @Field({ nullable: true })
  updatedDateTime: Date | null;
}
