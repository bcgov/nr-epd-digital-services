import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewParticipantNamesDto {
  @Field()
  id: number;

  @Field()
  firstName: string;

  @Field()
  middleName: string;

  @Field()
  lastName: string;
  
  @Field()
  fullName: string; 
}