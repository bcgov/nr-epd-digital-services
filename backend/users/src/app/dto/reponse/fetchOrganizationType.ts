import { Field, ObjectType } from '@nestjs/graphql';
import { OrganizationType } from 'src/app/entities/organizationType.entity';
import { BaseHttpResponse } from './baseHttpResponse';

@ObjectType()
export class FetchOrganizationTypeResponse extends BaseHttpResponse {
  @Field(() => [OrganizationType])
  data: OrganizationType[];
}
