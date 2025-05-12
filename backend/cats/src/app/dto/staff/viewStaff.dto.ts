import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ViewStaff {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    assignments: number;

    @Field()
    capacity: number;
}