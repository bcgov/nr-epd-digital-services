import { Field, ObjectType } from '@nestjs/graphql';
import { OrganizationType } from 'src/users/entities/organizationType.entity';
import { BaseHttpResponse } from './base-http-response';

@ObjectType()
export class FetchOrganizationTypeResponse extends BaseHttpResponse {
  @Field(() => [OrganizationType])
  data: OrganizationType[];
}
