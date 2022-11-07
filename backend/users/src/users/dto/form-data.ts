import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class FormData {
@Field()
  id:string;

  @Field()
  data:string;
}
