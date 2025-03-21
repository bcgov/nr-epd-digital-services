import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewApplication {

  @Field()
  id: number; // application id in CATS
}