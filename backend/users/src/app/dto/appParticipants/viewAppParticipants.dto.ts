import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAppParticipantsDto } from './baseAppParticipants.dto';

@ObjectType()
export class ViewAppParticipantsDto extends BaseAppParticipantsDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;
}
