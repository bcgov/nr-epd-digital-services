import { Field, Int, ObjectType } from "@nestjs/graphql";
import { BaseInvoiceItem } from "./baseInvoiceItem.dto";

@ObjectType()
export class ViewInvoiceItem extends BaseInvoiceItem{

    @Field(() => Int)
    id: number;

    @Field(() => Date)
    whenCreated: Date;
  
    @Field(() => Date)
    whenUpdated: Date;
  
    @Field(() => String)
    whoCreated: string;
  
    @Field(() => String)
    whoUpdated: string;
}