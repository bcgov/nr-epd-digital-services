import { Field, ObjectType } from '@nestjs/graphql';
import { Regions } from 'src/app/entities/regions';

import { BaseHttpResponse } from './baseHttpResponse';

@ObjectType()
export class FetchRegionResponse extends BaseHttpResponse {
  @Field(() => [Regions])
  data: Regions[];
}
