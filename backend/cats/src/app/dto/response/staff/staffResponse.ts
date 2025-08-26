import { Field, ObjectType } from '@nestjs/graphql';
import { PagedResponseDto } from '../response.dto';
import { ViewStaff } from '../../staff/viewStaff.dto';
import { ViewApplications } from '../../staff/viewApplications.dto';

@ObjectType()
export class StaffResponse extends PagedResponseDto {
  @Field(() => [ViewStaff])
  data: ViewStaff[];
}

@ObjectType()
export class ViewApplicationResponse extends PagedResponseDto {
  @Field(() => [ViewApplications])
  data: ViewApplications[];
}
