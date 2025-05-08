import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { ResponseDto } from '../response/response.dto';

@ObjectType()
export class ViewStaffAssignedDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;

  @Field({ nullable: true })
  currentCapacity: number | null;

  @Field()
  personId: number;

  @Field()
  roleId: number;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
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
