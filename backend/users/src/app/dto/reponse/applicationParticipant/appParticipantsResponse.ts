import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../responseDto';
import { ViewAppParticipantsDto } from '../../appParticipants/viewAppParticipantsDto';

@ObjectType()
export class AppParticipantsResponse extends ResponseDto {
  @Field(() => [ViewAppParticipantsDto], { nullable: true })
  data: ViewAppParticipantsDto[] | null;
}
