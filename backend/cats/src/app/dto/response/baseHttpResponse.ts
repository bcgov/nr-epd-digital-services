import { Field, Int, ObjectType } from '@nestjs/graphql';
import { format } from 'date-fns';

/**
 * Base class for returing response from graphql services
 */
@ObjectType()
export class BaseHttpResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => Int, { nullable: true })
  httpStatusCode?: number;

  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  @Field(() => String, { nullable: true })
  timestamp?: string;

  constructor(message?: string, httpStatusCode?: number, success?: boolean) {
    this.message = message;
    this.httpStatusCode = httpStatusCode;
    this.success = success;
    this.timestamp = format(new Date(), 'MMMM do, yyyy');
  }
}
