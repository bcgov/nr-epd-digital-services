import { Field, ObjectType } from '@nestjs/graphql';
import { Sites } from '../../entities/sites.entity';

import { BaseHttpResponse } from './baseHttpResponse';

/**
 * Class for returing fetch site response from graphql services
 */
@ObjectType()
export class FetchSiteResponse extends BaseHttpResponse {
    @Field(() => [Sites])
    data: Sites[];
}
