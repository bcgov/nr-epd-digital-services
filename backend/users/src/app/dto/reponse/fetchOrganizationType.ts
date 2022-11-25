import { Field, ObjectType } from '@nestjs/graphql';
import { OrganizationTypes } from 'src/app/entities/organizationTypes';
import { BaseHttpResponse } from './baseHttpResponse';

@ObjectType()
export class FetchOrganizationTypeResponse extends BaseHttpResponse {
  @Field(() => [OrganizationTypes])
  data: OrganizationTypes[];
}
