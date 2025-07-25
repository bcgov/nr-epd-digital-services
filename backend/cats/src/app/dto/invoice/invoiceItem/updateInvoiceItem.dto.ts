import { Field, InputType, Int } from "@nestjs/graphql";
import { BaseInvoiceItem } from "./baseInvoiceItem.dto";


@InputType()
export class UpdateInvoiceItem extends BaseInvoiceItem {
    @Field(() => Int, { nullable: true })
    id?: number;
}