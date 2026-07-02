import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export interface EmailRecipientPayload {
  email: string;
  personId?: number | null;
}

export class InvoiceEmail {
  @IsNotEmpty()
  @IsInt()
  invoiceId: number;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value)
  to: string; // JSON string of EmailRecipientPayload[]

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value)
  cc?: string | null; // JSON string of EmailRecipientPayload[]

  @IsString()
  @IsOptional()
  subject?: string | null;

  @IsString()
  @IsOptional()
  body?: string | null;
}
