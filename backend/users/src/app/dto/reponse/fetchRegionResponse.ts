import { Field, ObjectType } from '@nestjs/graphql';
import { Region } from '../../entities/region';

import { BaseHttpResponse } from './baseHttpResponse';

/**
 * Class for returing fetch region response from graphql services
 */
@ObjectType()
export class FetchRegionResponse extends BaseHttpResponse {
  @Field(() => [Region])
  data: Region[];
}
