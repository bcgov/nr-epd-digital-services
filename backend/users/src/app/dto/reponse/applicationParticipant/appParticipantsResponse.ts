import { Field, ObjectType } from '@nestjs/graphql';

import { ResponseDto } from '../response.dto';
import { ViewAppParticipantsDto } from '../../appParticipants/viewAppParticipants.dto';

@ObjectType()
export class AppParticipantsResponse extends ResponseDto {
  @Field(() => [ViewAppParticipantsDto], { nullable: true })
  data: ViewAppParticipantsDto[] | null;
}
