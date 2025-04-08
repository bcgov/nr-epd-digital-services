import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewParticipantNamesDto } from '../../appParticipants/ViewParticipantNames.dto';

@ObjectType()
export class ParticipantNamesResponse extends ResponseDto {
  @Field(() => [ViewParticipantNamesDto], { nullable: true })
  data: ViewParticipantNamesDto[] | null;
}
