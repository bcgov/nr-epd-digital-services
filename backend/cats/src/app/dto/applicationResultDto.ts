import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@ObjectType()
export class ApplicationResultPersonDto {
  @Field()
  @IsString()
  @Length(1, 50)
  firstName: string;

  @Field()
  @IsString()
  @Length(1, 50)
  lastName: string;
}

@ObjectType()
export class ApplicationResultDto {
  @Field()
  id: string;

  @Field()
  siteId: string;

  @Field()
  siteAddress: string;

  @Field()
  applicationType: string;

  @Field()
  lastUpdated: string;

  @Field()
  status: string;

  @Field(() => [ApplicationResultPersonDto])
  staffAssigned: ApplicationResultPersonDto[];

  @Field()
  priority: string;

  @Field()
  url: string;

  @Field()
  siteRiskClassification: string;

  @Field()
  csapReference: string;

  @Field()
  serviceType: string;

  @Field()
  commonName: string;
}
