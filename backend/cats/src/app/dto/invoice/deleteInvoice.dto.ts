import { Field, InputType, Int } from "@nestjs/graphql";

@InputType()
export class DeleteInvoice {
    @Field(() => Int)
    id: number;
}