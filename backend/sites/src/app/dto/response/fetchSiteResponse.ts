import { Field, ObjectType } from '@nestjs/graphql';
import { Sites } from '../../entities/sites.entity';
import { BaseHttpResponse } from './baseHttpResponse';
import { RecentViews } from '../../entities/recentViews.entity';

/**
 * Class for returing fetch site response from graphql services
 */
@ObjectType()
export class FetchSiteResponse extends BaseHttpResponse {
    @Field(() => [Sites])
    data: Sites[];
}

/**
 * Class for returing fetch site response from graphql services
 */
@ObjectType()
export class FetchSiteDetail extends BaseHttpResponse {
    @Field(() => Sites)
    data: Sites;
}

/**
 * Class for returing search site response from graphql services
 */
@ObjectType()
export class SearchSiteResponse {
    @Field(() => [Sites])
    sites: Sites[];

    @Field()
    count: number;

    @Field()
    page: number;

    @Field()
    pageSize: number;

}


@ObjectType()
export class DashboardResponse extends BaseHttpResponse{
    @Field({nullable:true})
    message: string;

    @Field(() => [RecentViews],  { nullable: true })
    data: RecentViews[] | null;
}