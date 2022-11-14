import { InputType, Field } from '@nestjs/graphql';
import {Length, IsNotEmpty} from 'class-validator'

@InputType()
export class CreateUserInput {
  @Field()
  @Length(1,256)
  @IsNotEmpty()
  name:string;
}
