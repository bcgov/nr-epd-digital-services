import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class BaseInvoiceAttachment {
    @Field(() => Int)
    invoiceId: number;

    @Field()
    fileName: string;

    @Field()
    bucketId: string;
        
    @Field()
    objectId: string;
}