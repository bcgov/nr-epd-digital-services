import { Field, ObjectType } from '@nestjs/graphql';
import { ViewAppParticipantsDto } from '../../appParticipants/viewAppParticipantsDto';
import { ResponseDto } from '../response.dto';

@ObjectType()
export class AppParticipantsResponse extends ResponseDto {
  @Field(() => [ViewAppParticipantsDto], { nullable: true })
  data: ViewAppParticipantsDto[] | null;
}
