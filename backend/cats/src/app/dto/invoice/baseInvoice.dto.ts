import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { InvoiceStatus } from "../../utilities/enums/invoice/invoiceStatus.enum";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class BaseInvoice {

   @Field(() => String)
   personId: string;

   @Field(() => String)
   subject: string;
 
   @Field(() => Date)
   issuedDate: Date;
 
   @Field(() => Date)
   dueDate: Date;
 
   @Field(() => InvoiceStatus)
   invoiceStatus: InvoiceStatus;

   @Field(() => Boolean)
   taxExempt: boolean;

   @Field(() => Boolean)
   pstExempt: boolean;

   @Field(() => Int)
   subtotalInCents: number;

   @Field(() => Int)
   gstInCents: number;

   @Field(() => Int)
   pstInCents: number;

   @Field(() => Int)
   totalInCents: number;

   @Field(() => String, { nullable: true })
   invoiceNotes: string;
}