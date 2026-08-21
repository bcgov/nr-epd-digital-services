import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response/response.dto';

@ObjectType()
export class FinancialSummaryDto {
  @Field(() => Float)
  totalHoursWorked: number;

  @Field(() => Int)
  totalHoursInvoiced: number;

  @Field(() => Int)
  totalCostOfServicesInCents: number;

  @Field(() => Int)
  totalAmountInvoicedInCents: number;

  @Field(() => Int)
  totalAmountPaidInCents: number;

  @Field(() => Int)
  outstandingBalanceInCents: number;
}

@ObjectType()
export class FinancialSummaryResponse extends ResponseDto {
  @Field(() => FinancialSummaryDto, { nullable: true })
  data?: FinancialSummaryDto | null;
}
