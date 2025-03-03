import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ResponseDto {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  httpStatusCode?: number;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  @Field(() => String, { nullable: true })
  timestamp?: string;
}