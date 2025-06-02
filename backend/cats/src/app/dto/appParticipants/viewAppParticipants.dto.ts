import { Field, ObjectType } from '@nestjs/graphql';
import { BaseAppParticipantsDto } from './baseAppParticipants.dto';
import { IsString } from 'class-validator';
import { ViewOrganizationsDto } from './viewOrganization.dto';
import { ViewParticipantNamesDto } from './ViewParticipantNames.dto';
import { ViewParticipantsRolesDto } from './viewParticipantsRoles.dto';

@ObjectType()
export class ViewAppParticipantsDto extends BaseAppParticipantsDto {
  @Field()
  id: number;

  @Field()
  applicationId: number;

  @Field({ defaultValue: false })
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
  isMinistry: boolean;

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

  @Field(() => ViewOrganizationsDto, { nullable: true })
  organization: ViewOrganizationsDto | null;

  @Field(() => ViewParticipantNamesDto)
  person: ViewParticipantNamesDto;

  @Field(() => ViewParticipantsRolesDto)
  participantRole: ViewParticipantsRolesDto;

}
