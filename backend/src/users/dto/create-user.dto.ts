import { PickType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";
import {InputType,Field,
Int} from "@nestjs/graphql"

@InputType()
export class CreateUserDto {
  @Field() 
  name: string;

  @Field()  
  email: string;
}
