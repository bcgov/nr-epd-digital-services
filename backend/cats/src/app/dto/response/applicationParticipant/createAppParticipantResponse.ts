import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewAppParticipantEntityDto } from '../../appParticipants/viewAppParticipantEntity.dto';

@ObjectType()
export class CreateAppParticipantsResponse extends ResponseDto {
  @Field(() => [ViewAppParticipantEntityDto], { nullable: true })
  data: ViewAppParticipantEntityDto[] | null;
}
