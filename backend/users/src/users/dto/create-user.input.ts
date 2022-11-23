import { InputType, Field, Int } from '@nestjs/graphql';
import { Length, IsNotEmpty } from 'class-validator';

@InputType({})
export class CreateUserInput {
  // @Field()
  // id:number;

  @Field()
  @Length(1, 50)
  userId: string;

  @Field()
  @Length(1, 66)
  @IsNotEmpty()
  firstName: string;

  @Field()
  @Length(1, 66)
  @IsNotEmpty()
  lastName: string;

  @Field()
  @Length(1, 200)
  @IsNotEmpty()
  addressLine: string;

  @Field()
  @Length(1, 50)
  @IsNotEmpty()
  city: string;

  @Field()
  @Length(1, 50)
  @IsNotEmpty()
  province: string;

  @Field()
  @Length(1, 50)
  @IsNotEmpty()
  country: string;

  @Field()
  @Length(1, 20)
  @IsNotEmpty()
  postalCode: string;

  @Field()
  @Length(1, 320)
  @IsNotEmpty()
  email: string;

  @Field()
  @Length(1, 40)
  @IsNotEmpty()
  phoneNumber: string;

  @Field()
  @Length(1, 250)
  @IsNotEmpty()
  organization: string;

  @Field(() => Int)
  @IsNotEmpty()
  userTypeId: number;

  @Field(() => Int)
  @IsNotEmpty()
  organizationTypeId: number;

  @Field(() => Int)
  @IsNotEmpty()
  userWorkTypeId: number;

  @Field(() => Boolean)
  @IsNotEmpty()
  isGstExempt: boolean;

  @Field(() => Boolean)
  @IsNotEmpty()
  isBillingContact: boolean;
}
