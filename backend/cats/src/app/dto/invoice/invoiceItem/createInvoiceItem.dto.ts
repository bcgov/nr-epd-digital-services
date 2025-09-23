import { Field, InputType } from "@nestjs/graphql";
import { BaseInvoiceItem } from "./baseInvoiceItem.dto";


@InputType()
export class CreateInvoiceItem extends BaseInvoiceItem {}
