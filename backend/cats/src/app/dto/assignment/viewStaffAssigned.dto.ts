import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response/response.dto';
import { BaseStaffAssignedDto } from './baseStaffAssigned.dto';

@ObjectType()
export class ViewStaffAssignedDto extends BaseStaffAssignedDto {
  @Field()
  id: number;

  @Field({ nullable: true })
  currentCapacity: number | null;
}

@ObjectType()
export class StaffAssignedDto {
  @Field({ nullable: true })
  applicationServiceTypeId: number | null;

  @Field(() => [ViewStaffAssignedDto])
  staffList: ViewStaffAssignedDto[];
}

@ObjectType()
export class ViewStaffAssignedResponse extends ResponseDto {
  @Field(() => StaffAssignedDto, { nullable: true })
  data: StaffAssignedDto | null;
}