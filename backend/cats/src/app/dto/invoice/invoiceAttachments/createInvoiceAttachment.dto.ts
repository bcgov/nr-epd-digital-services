import { Field, InputType } from '@nestjs/graphql';
import { BaseInvoiceAttachment } from './baseInvoiceAttachment.dto';

@InputType()
export class CreateInvoiceAttachment extends BaseInvoiceAttachment {}
