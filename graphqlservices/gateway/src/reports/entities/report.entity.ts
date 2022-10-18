import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Report {
  

  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  id:number;

  @Field()
  @Column({name:"name"})
  name:string;
  
}
