import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { BaseAppParticipantsDto } from './baseAppParticipants.dto';

@InputType()
export class UpdateAppParticipantDto extends BaseAppParticipantsDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;
}
