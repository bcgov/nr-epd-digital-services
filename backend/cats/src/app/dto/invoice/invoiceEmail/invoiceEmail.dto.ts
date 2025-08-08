import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class InvoiceEmail {
    @IsNotEmpty()
    @IsInt()
    invoiceId: number;

    @IsEmail()
    @IsNotEmpty()
    to: string;

    @IsString()
    @IsOptional()
    subject?: string | null;

    @IsString()
    @IsOptional()
    body?: string | null;
}