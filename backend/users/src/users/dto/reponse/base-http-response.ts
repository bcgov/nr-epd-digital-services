import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class BaseHttpResponse{

    @Field(()=>Int)
    httpStatusCode:number;
}