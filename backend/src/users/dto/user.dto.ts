import { ApiProperty } from "@nestjs/swagger";
import { Base } from "./base.dto";
import {InputType, Field,Int} from "@nestjs/graphql"


export class UserDto extends Base {

  @Field(type=>Int)
  @ApiProperty({
    description: "The ID of the user",
    // default: '9999',
  })
  id: number;
  @Field()
  @ApiProperty({
    description: "The name of the user",
    // default: 'username',
  })
  name: string;
  @Field()
  @ApiProperty({
    description: "The contact email of the user",
    default: "",
  })
  email: string;
}
