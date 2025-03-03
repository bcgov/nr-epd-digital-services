import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, Length } from 'class-validator';

@ObjectType()
@InputType()
export class BasePersonNote {
  @Field()
  @IsString()
  @Length(1, 5000)
  noteDescription: string;
}