import { Field, ObjectType } from '@nestjs/graphql';
import { Region } from 'src/users/entities/region.entity';

import { BaseHttpResponse } from './base-http-response';

@ObjectType()
export class FetchRegionResponse extends BaseHttpResponse {
  @Field(() => [Region])
  data: Region[];
}
