import { Field, ObjectType } from '@nestjs/graphql';
import { PagedResponseDto } from '../response.dto';
import { ViewStaff } from '../../staff/viewStaff.dto';

@ObjectType()
export class StaffResponse extends PagedResponseDto {
  @Field(() => [ViewStaff])
  data: ViewStaff[];
}
