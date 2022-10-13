import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ApiProperty } from "@nestjs/swagger";
import { Users } from 'src/users/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@ObjectType()
@Entity()
export class Application {
  @Field(type=>Int)
  @ApiProperty({
    example: "1",
    description: "The ID of the application",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @ApiProperty({ example: " application name", description: "The name of the application" })
  @Column()
  name: string;

  @ManyToOne(()=>Users, user=> user.applications)
  @Field(()=>Users)
  user:Users

  @Field(type=>Int)
  @Column()
  userId:number;

}
