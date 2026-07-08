import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType('EmailRecipientInput')
@ObjectType('EmailRecipientType')
export class EmailRecipientDto {
  @Field(() => String)
  email: string;

  @Field(() => Int, { nullable: true })
  personId?: number | null;

  @Field(() => String, { nullable: true })
  displayName?: string;
}
