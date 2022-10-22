import { ObjectType,Field ,Int } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { application } from "express";
import { Application } from "../../applications/entities/application.entity"
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@ObjectType()
@Entity()
export class Users {

  @Field(type=>Int)
  @ApiProperty({
    example: "1",
    description: "The ID of the user",
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @ApiProperty({ example: "Peter Green", description: "The name of the user" })
  @Column()
  name: string;

  @Field()
  @ApiProperty({
    example: "abc@gmail.com",
    description: "The email of the user",
  })
  @Column()
  email: string;


  @OneToMany(()=>Application, application=>application.user)
  @Field(()=>[Application],{nullable:true})
  applications:Application[]

  constructor(name?: string, email?: string) {
    this.name = name || "";
    this.email = email || "";
  }
}
