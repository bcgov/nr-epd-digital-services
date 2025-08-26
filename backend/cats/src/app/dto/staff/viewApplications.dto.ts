import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewApplications {
  @Field()
  id: number;

  @Field()
  applicationId: number;

  @Field()
  roleId: number;

  @Field()
  roleDescription: string;

  @Field()
  siteAddress: string;

  @Field()
  effectiveStartDate: Date;

  @Field({ nullable: true })
  effectiveEndDate?: Date | null;
}
