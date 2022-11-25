import { Field, ObjectType } from '@nestjs/graphql';
import { Region } from 'src/app/entities/region.entity';

import { BaseHttpResponse } from './baseHttpResponse';

@ObjectType()
export class FetchRegionResponse extends BaseHttpResponse {
  @Field(() => [Region])
  data: Region[];
}
