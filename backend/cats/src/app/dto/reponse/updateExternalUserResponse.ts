import { Field, ObjectType } from '@nestjs/graphql';
import { BaseHttpResponse } from './baseHttpResponse';

/**
 * Class for returing external user response from graphql services
 */
@ObjectType()
export class UpdateExternalUserResponse extends BaseHttpResponse {
  @Field(() => Boolean)
  recordUpdated: boolean;
}
