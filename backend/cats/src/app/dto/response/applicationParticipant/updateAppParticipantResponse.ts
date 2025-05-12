import { Field, ObjectType } from '@nestjs/graphql';
import { ViewAppParticipantsDto } from '../../appParticipants/viewAppParticipants.dto';
import { ResponseDto } from '../response.dto';
import { ViewAppParticipantEntityDto } from '../../appParticipants/viewAppParticipantEntity.dto';

@ObjectType()
export class UpdateAppParticipantsResponse extends ResponseDto {
  @Field(() => [ViewAppParticipantEntityDto], { nullable: true })
  data: ViewAppParticipantEntityDto[] | null;
}
