import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ViewDashboard {
  @Field()
  applicationId: number;

  @Field({ nullable: true })
  siteId?: number | null;

  @Field({ nullable: true })
  address?: string | null;

  @Field({ nullable: true })
  applicationType?: string | null;

  @Field({ nullable: true })
  applicationStatus?: string | null;

  @Field({ nullable: true })
  receivedDate?: Date | null;

  @Field({ nullable: true })
  priority?: string | null;
}
