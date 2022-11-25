import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * Base class for returing response from graphql services
 */
@ObjectType()
export class BaseHttpResponse {
  @Field(() => Int)
  httpStatusCode: number;
}
