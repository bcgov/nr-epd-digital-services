import { Field, ObjectType } from "@nestjs/graphql";
import { ResponseDto } from "../response.dto";
import { RecentViewedApplication } from "../../../entities/RecentViewedApplication.entity";

@ObjectType()
export class DashboardResponse extends ResponseDto {
    @Field(() => [RecentViewedApplication], {nullable: true})
    data?: RecentViewedApplication[] | null;
}