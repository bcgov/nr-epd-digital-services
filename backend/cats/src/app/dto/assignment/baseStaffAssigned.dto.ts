import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
@InputType()
export class BaseStaffAssignedDto {
  @Field()
  applicationId: number;

  @Field()
  personId: number;

  @Field()
  roleId: number;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate: Date;
}
