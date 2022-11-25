import { Field, ObjectType } from '@nestjs/graphql';
import { ExternalUsers } from '../../entities/externalUsers';
import { BaseHttpResponse } from './baseHttpResponse';

@ObjectType()
export class FetchUserResponse extends BaseHttpResponse {
  @Field(() => [ExternalUsers])
  data: ExternalUsers[];
}
