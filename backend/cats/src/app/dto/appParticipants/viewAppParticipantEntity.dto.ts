import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsDate } from "class-validator";

@ObjectType() 
export class ViewAppParticipantEntityDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;

  @Field()
  personId: number;

  @Field()
  participantRoleId: number;

  @Field({nullable: true} )
  organizationId: number | null;

  @Field({defaultValue: false})
  isMainParticipant: boolean;

  @Field()
  @IsDate()
  effectiveStartDate: Date;

  @Field({ nullable: true })
  @IsDate()
  effectiveEndDate: Date;

  @Field({ nullable: true })
  rowVersionCount: number | null;

  @Field()
  createdBy: string;

  @Field()
  createdDateTime: Date;

  @Field({ nullable: true })
  updatedBy: string | null;

  @Field({ nullable: true })
  updatedDateTime: Date | null;

  // @Field()
  // ts: Buffer | null;
}
