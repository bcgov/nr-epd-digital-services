import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class DetailField {
  @Field()
  id: number;

  @Field()
  abbrev: string;

  @Field()
  description: string;
}

@ObjectType()
export class ViewApplicationDetails {
  @Field()
  id: number;

  @Field({ nullable: true })
  siteId: number;

  @Field({ nullable: true })
  siteAddress: string;

  @Field({ nullable: true })
  siteCity: string;

  @Field({ nullable: true })
  csapRefNumber: string;

  @Field(() => Date)
  receivedDate: Date;

  @Field(() => Date, { nullable: true })
  queuedDate: Date | null;

  @Field(() => Date, { nullable: true })
  endDate: Date | null;

  @Field(() => DetailField, { nullable: true })
  outcome?: DetailField;

  @Field(() => DetailField, { nullable: true })
  appType?: DetailField;

  @Field(() => DetailField, { nullable: true })
  currentStatus?: DetailField;

  @Field(() => DetailField, { nullable: true })
  siteType?: DetailField;

  @Field(() => DetailField, { nullable: true })
  reviewProcess?: DetailField;

  @Field(() => DetailField, { nullable: true })
  priority?: DetailField;

  @Field(() => Boolean, { defaultValue: false })
  isHousing: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isTaxExempt: boolean;

  @Field({ nullable: true })
  formId: string | null;

  @Field({ nullable: true })
  submissionId: string | null;
}
