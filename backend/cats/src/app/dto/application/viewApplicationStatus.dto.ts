import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewApplicationStatus {

  @Field()
  formsflowAppId: number; // application id in formsflow
}