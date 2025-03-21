import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  IsDate,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsPositive,
  IsInt,
} from 'class-validator';

@ObjectType()
class YesNoCodeDto {
  @Field(() => Int)
  id: number;

  @Field()
  abbrev: string;
}

@ObjectType()
class HousingType {
  @Field(() => Int)
  id: number;

  @Field()
  abbrev: string;

  @Field()
  description: string;
}

@ObjectType()
class HousingDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  numberOfUnits: number;

  @Field(() => Date, { nullable: true })
  effectiveDate: Date | null;

  @Field(() => Date, { nullable: true })
  expiryDate: Date | null;

  @Field()
  isRental: YesNoCodeDto;

  @Field()
  isSocial: YesNoCodeDto;

  @Field()
  isIndigenousLed: YesNoCodeDto;

  @Field()
  housingType: HousingType;

  @Field(() => [Int])
  relatedApplications: number[];
}

@ObjectType()
export class ApplicationHousingDto {
  @Field(() => Int)
  id: number;

  @Field()
  housing: HousingDto;
}

@InputType()
export class AddHousingInputDto {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  applicationId: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  housingTypeId: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  numberOfUnits: number;

  @Field()
  @IsDate()
  @IsNotEmpty()
  effectiveDate: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  expiryDate?: Date;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isRental?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isSocial?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isIndigenousLed?: boolean;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  relatedApplicationIds?: number[];
}

@InputType()
export class UpdateHousingInputDto {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  applicationHousingId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  housingTypeId?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsPositive()
  @IsOptional()
  numberOfUnits?: number;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  effectiveDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  expiryDate?: Date;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isRental?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isSocial?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isIndigenousLed?: boolean;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  relatedApplicationIds?: number[];
}
