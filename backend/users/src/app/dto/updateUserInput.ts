import { CreateUserInput } from './createUserInput';
import { InputType, Field, PartialType } from '@nestjs/graphql';

/**
 * DTO for updating external user
 */
@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field()
  id: string;
}
