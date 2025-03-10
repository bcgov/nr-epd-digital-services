import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewParticipantsRolesDto {
  @Field()
  id: number;

  @Field()
  description: string;
}
