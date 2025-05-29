import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from './response.dto';
import { TimesheetDayDto } from '../timesheetDay.dto';

@ObjectType()
export class TimesheetDayResponse extends ResponseDto {
  @Field(() => [TimesheetDayDto])
  data: TimesheetDayDto[];
}
