import { Field, ObjectType } from '@nestjs/graphql';
import { ExternalUser } from '../../entities/externalUser';
import { BaseHttpResponse } from './baseHttpResponse';

/**
 * Class for returing external user response from graphql services
 */
@ObjectType()
export class FetchSingleUserResponse extends BaseHttpResponse {
  @Field(() => ExternalUser, { nullable: true })
  data?: ExternalUser;

  @Field(() => Boolean)
  profileVerified: boolean;
}
