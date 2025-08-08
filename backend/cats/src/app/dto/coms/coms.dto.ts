import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Coms {
    
    @Field({ nullable: true })
    bucketId?: string | null

    @Field({ nullable: true })
    objectId?: string | null

    @Field({ nullable: true })
    downloadUrl?: string | null
}