import { Field, InputType } from '@nestjs/graphql';

@InputType('CreatePersonInput')
export class CreatePersonInput {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  middleName: string | null;

  @Field(() => String)
  lastName: string;

  @Field(() => Boolean)
  isTaxExempt: boolean;

  @Field(() => Boolean)
  isEnvConsultant: boolean;

  @Field(() => String)
  loginUserName: string | null;

  @Field(() => String)
  address_1: string | null;

  @Field(() => String)
  address_2: string | null;

  @Field(() => String)
  city: string | null;

  @Field(() => String)
  prov: string | null;

  @Field(() => String)
  country: string | null;

  @Field(() => String)
  postal: string | null;

  @Field(() => String)
  phone: string | null;

  @Field(() => String)
  mobile: string | null;

  @Field(() => String)
  fax: string | null;

  @Field(() => String)
  email: string | null;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Number)
  rowVersionCount: number;

  @Field(() => String)
  createdBy: string;

  @Field(() => Date)
  createdDatetime: Date;

  @Field(() => String)
  updatedBy: string;

  @Field(() => Date)
  updatedDatetime: Date;
}
