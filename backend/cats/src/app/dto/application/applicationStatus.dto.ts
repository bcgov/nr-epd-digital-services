import {
  Field,
  InputType,
  Int,
} from '@nestjs/graphql';

@InputType()
export class ApplicationStatusDto {
  @Field({ nullable: true }) // Optional for new line items
  id?: number;

  @Field()
  applicationId: number;

  @Field()
  statusTypeAbbrev: string;

  @Field(() => Boolean)
  isCurrent: boolean;

  @Field()
  formId: string; // the formId in formsflow

  @Field()
  submissionId: string; // the submission id in formsflow
}
