import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response/response.dto';

@ObjectType()
export class ViewStaffWithCapacityDTO {
  @Field()
  personId: number;

  @Field()
  personFullName: string;

  @Field({ nullable: true })
  currentCapacity: number | null;
}

@ObjectType()
export class ViewStaffWithCapacityResponse extends ResponseDto {
  @Field(() => [ViewStaffWithCapacityDTO], { nullable: true })
  data: ViewStaffWithCapacityDTO[] | null;
}

@ObjectType()
export class StaffGroupedByRoleDTO {
  @Field()
  roleId: number;

  @Field()
  roleName: string;

  @Field()
  roleAbbrev: string;

  @Field(() => [ViewStaffWithCapacityDTO])
  staff: ViewStaffWithCapacityDTO[];
}

@ObjectType()
export class StaffGroupedByRoleResponse extends ResponseDto {
  @Field(() => [StaffGroupedByRoleDTO], { nullable: true })
  data: StaffGroupedByRoleDTO[] | null;
}
