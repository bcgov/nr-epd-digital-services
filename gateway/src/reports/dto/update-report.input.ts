import { CreateReportInput } from './create-report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReportInput extends PartialType(CreateReportInput) {
  @Field(() => Int)
  id: number;
}
