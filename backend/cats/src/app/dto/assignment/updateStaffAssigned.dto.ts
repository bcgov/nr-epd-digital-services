import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { BaseStaffAssignedDto } from './baseStaffAssigned.dto';

@InputType()
export class UpdateStaffAssignedDto extends BaseStaffAssignedDto {
  @Field()
  id: number;

  @Field({ nullable: true })
  organizationId: number | null;

  @Field()
  action: string;
}
