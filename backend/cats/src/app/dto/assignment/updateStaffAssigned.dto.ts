import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@InputType()
export class UpdateStaffAssignedDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;

  @Field()
  personId: number;

  @Field()
  roleId: number;

  @Field({ nullable: true })
  organizationId: number | null;

  @Field()
  @IsDate()
  startDate: Date;

  @Field({ nullable: true })
  @IsDate()
  endDate: Date;

  @Field()
  action: string;
}
