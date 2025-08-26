import { Field, ObjectType } from "@nestjs/graphql";
import { ResponseDto } from "../response.dto";
import { Coms } from "../../coms/coms.dto";

@ObjectType()
export class ComsResponse extends ResponseDto {
   @Field(() => Coms, { nullable: true })
   data?: Coms | null;
}