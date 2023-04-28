import { CreateApplicationInput } from './createApplication.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateApplicationInput extends PartialType(
  CreateApplicationInput,
) {
  @Field(() => Int)
  id: number;
}
