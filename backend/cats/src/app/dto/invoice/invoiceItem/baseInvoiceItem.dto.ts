import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { InvoiceItemType } from "../../../utilities/enums/invoice/invoiceItemType.enum";


@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class BaseInvoiceItem {
    @Field()
    description: string;
    
    @Field(() => Int)
    quantity: number;
    
    @Field(() => Int)
    unitPriceInCents: number;
    
    @Field(() => Int)
    totalInCents: number;

    @Field()
    itemType: InvoiceItemType;

}