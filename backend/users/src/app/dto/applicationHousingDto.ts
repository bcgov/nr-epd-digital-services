import { Field, Int, ObjectType } from '@nestjs/graphql';

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
