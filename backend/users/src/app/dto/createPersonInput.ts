import { Field, InputType } from '@nestjs/graphql';

@InputType('CreatePersonInput')
export class CreatePersonInput {
  @Field(() => Number, { nullable: true })
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => Boolean)
  isTaxExempt: boolean;

  @Field(() => Boolean)
  isEnvConsultant: boolean;

  @Field(() => String)
  loginUserName: string;

  @Field(() => String)
  address_1: string;

  @Field(() => String, { nullable: true })
  address_2?: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  province: string;

  @Field(() => String)
  country: string;

  @Field(() => String)
  postalCode: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  mobile?: string;

  @Field(() => String, { nullable: true })
  fax?: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  isActive: boolean;
}
