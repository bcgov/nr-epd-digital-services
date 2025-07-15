import { Field, ObjectType } from "@nestjs/graphql";
import { ResponseDto } from "../response.dto";
import { ViewDashboard } from "../../dashboard/viewDashboard.dto";

@ObjectType()
export class DashboardResponse extends ResponseDto {
    @Field(() => [ViewDashboard], {nullable: true})
    data?: ViewDashboard[] | null;
}