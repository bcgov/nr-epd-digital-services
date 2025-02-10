import { Field, InputType } from '@nestjs/graphql';

@InputType('CreatePersonInput')
export class CreatePersonInput {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })  // nullable: true
  middleName: string | null;

  @Field(() => String)
  lastName: string;

  @Field(() => Boolean)
  isTaxExempt: boolean;

  // @Field(() => Boolean, { nullable: true })  // nullable: true
  // isEnvConsultant: boolean | null;

  @Field(() => String, { nullable: true })  // nullable: true
  loginUserName: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  address_1: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  address_2: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  city: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  prov: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  country: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  postal: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  phone: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  mobile: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  fax: string | null;

  @Field(() => String, { nullable: true })  // nullable: true
  email: string | null;

  @Field(() => Boolean)
  isActive: boolean;

  // @Field(() => Number, { nullable: true })  // nullable: true
  // rowVersionCount: number | null;

  // @Field(() => String)
  // createdBy: string;

  // @Field(() => Date)
  // createdDatetime: Date;

  // @Field(() => String, { nullable: true })  // nullable: true
  // updatedBy: string | null;

  @Field(() => Date)
  updatedDatetime: Date;

  @Field(() => Boolean, { nullable: true })
  isDeleted?: boolean;
}
