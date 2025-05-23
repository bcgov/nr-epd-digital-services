import { Field, ObjectType } from '@nestjs/graphql';
import { ViewAppParticipantsDto } from '../../appParticipants/viewAppParticipants.dto';
import { ResponseDto } from '../response.dto';
import { ViewAppParticipantEntityDto } from '../../appParticipants/viewAppParticipantEntity.dto';

@ObjectType()
export class AppParticipantsResponse extends ResponseDto {
  @Field(() => [ViewAppParticipantsDto], { nullable: true })
  data: ViewAppParticipantsDto[] | null;
}
