import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewParticipantsRolesDto } from '../../appParticipants/viewParticipantsRoles.dto';

@ObjectType()
export class ParticipantsRolesResponse extends ResponseDto {
  @Field(() => [ViewParticipantsRolesDto], { nullable: true })
  data: ViewParticipantsRolesDto[] | null;
}
