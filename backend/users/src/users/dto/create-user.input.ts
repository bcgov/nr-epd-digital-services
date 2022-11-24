import { InputType, Field, Int } from '@nestjs/graphql';
import { Length, IsNotEmpty } from 'class-validator';
import { Region } from '../entities/region.entity';

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

  @Field()
  @Length(1, 10)
  userWorkStatus: string;

  @Field()
  @Length(1, 25)
  userFNStatus: string;

  @Field(() => Boolean)
  @IsNotEmpty()
  isGstExempt: boolean;

  @Field(() => Boolean)
  @IsNotEmpty()
  isBillingContact: boolean;

  @Field(() => Boolean)
  @IsNotEmpty()
  isProfileVerified: Boolean;

  @Field()
  @Length(1, 250)
  industry: string;

  @Field(() => Int)
  regionId: number;

  @Field(() => Int)
  organizationTypeId: number;
}
