import { Field, ObjectType } from '@nestjs/graphql';
import { ExternalUser } from '../../entities/externalUser';
import { BaseHttpResponse } from './baseHttpResponse';

/**
 * Class for returing external user response from graphql services
 */
@ObjectType()
export class FetchUserResponse extends BaseHttpResponse {
  @Field(() => [ExternalUser])
  data: ExternalUser[];
}
