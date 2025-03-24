import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';

@ObjectType()
@InputType()
export class BaseAppParticipantsDto {
  // @Field()
  // personId: number;

  // @Field()
  // participantRoleId: number;

  // @Field({nullable: true} )
  // organizationId: number | null;

  @Field({defaultValue: false})
  isMainParticipant: boolean;

  @Field()
  @IsString()
  firstName: string;

  @Field()
  @IsString()
  lastName: string;

  @Field()
  @IsString()
  fullName: string;

  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsDate()
  effectiveStartDate: Date;

  @Field({ nullable: true })
  @IsDate()
  effectiveEndDate: Date;

  @Field()
  isMinistry: boolean;
}
