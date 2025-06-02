import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsString } from 'class-validator';
import { BaseAppParticipantsDto } from './baseAppParticipants.dto';

@InputType()
export class CreateAppParticipantDto extends BaseAppParticipantsDto {

    @Field()
    applicationId: number;

    @Field({ defaultValue: false })
    isMainParticipant: boolean;

    @Field()
    personId: number;

    @Field()
    participantRoleId: number;

    @Field({ nullable: true })
    organizationId: number | null;

    @Field({ nullable: true })
    createdBy: string;

    @Field({ nullable: true })
    createdDateTime: Date;
}
