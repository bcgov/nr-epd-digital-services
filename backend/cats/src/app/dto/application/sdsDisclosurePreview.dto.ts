import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response/response.dto';

@ObjectType()
export class Schedule2ReferenceDto {
  @Field()
  code: string;

  @Field({ nullable: true })
  description: string | null;
}

@ObjectType()
export class SdsDisclosureDto {
  @Field({ nullable: true })
  siteRegDateRecd: string | null;

  @Field({ nullable: true })
  dateCompleted: string | null;

  @Field({ nullable: true })
  localAuthDateRecd: string | null;

  @Field({ nullable: true })
  rwmDateDecision: string | null;

  @Field({ nullable: true })
  siteRegDateEntered: string | null;

  @Field(() => [Schedule2ReferenceDto])
  schedule2References: Schedule2ReferenceDto[];

  @Field({ nullable: true })
  plannedActivityComment: string | null;

  @Field({ nullable: true })
  siteDisclosureComment: string | null;

  @Field({ nullable: true })
  govDocumentsComment: string | null;
}

@ObjectType()
export class SdsDisclosurePreviewDto {
  @Field(() => SdsDisclosureDto, { nullable: true })
  disclosure: SdsDisclosureDto | null;

  @Field(() => Int, { nullable: true })
  siteId: number | null;

  @Field(() => Int, { nullable: true })
  lastPushedSiteId: number | null;

  @Field({ nullable: true })
  lastPushedAt: string | null;
}

@ObjectType()
export class SdsDisclosurePreviewResponse extends ResponseDto {
  @Field(() => SdsDisclosurePreviewDto, { nullable: true })
  data: SdsDisclosurePreviewDto | null;
}
