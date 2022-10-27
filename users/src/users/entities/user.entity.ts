import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { Application } from './application.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class User {

  @Field(()=>Int)
  @PrimaryGeneratedColumn()
  id:number;


  @Field()
  @Column({name:"name"})
  name:string;


  // @Field((type) => [Application])
  // applications?: Application[];

}
