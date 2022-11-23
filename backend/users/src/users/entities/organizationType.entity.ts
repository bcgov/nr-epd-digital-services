import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Index, PrimaryColumn } from "typeorm";


@ObjectType()
@Entity({name:'organization_type'})
export class OrganizationType{

    @Field(()=>Int)
    @Index('IDX_organization_type_id')
    @PrimaryColumn()    
    id:number;


    @Field()
    @Column({ length: 50, name: 'name' })
    name:string;
}