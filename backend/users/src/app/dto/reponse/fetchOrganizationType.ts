import { Field, ObjectType } from '@nestjs/graphql';
import { OrganizationType } from '../../entities/organizationType';
import { BaseHttpResponse } from './baseHttpResponse';

/**
 * Class for returing orgnization type response from graphql services
 */
@ObjectType()
export class FetchOrganizationTypeResponse extends BaseHttpResponse {
  @Field(() => [OrganizationType])
  data: OrganizationType[];
}
