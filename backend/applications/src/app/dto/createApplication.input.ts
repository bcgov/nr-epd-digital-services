import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateApplicationInput {
  @Field()
  name: string;

  @Field(() => Int)
  userId: string;
}
