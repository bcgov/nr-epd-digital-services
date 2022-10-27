import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
@Entity()
export class Application {

  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id:number;


  @Field({nullable:true})
  @Column({name:"name",nullable:true})
  name:string;

  @Field(()=>User)
  user:User

  @Column({nullable:true})
  @Field((type)=>Int)
  userId:number;

}
