import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsDate, IsString, isString } from "class-validator";
import { ResponseDto } from "./reponse/responseDto";

@ObjectType()
export class AppParticipantsResponse extends ResponseDto {
    @Field(() => [AppParticipantsDto], {nullable: true})
    data: AppParticipantsDto[] | null;
}

@ObjectType()
export class AppParticipantsDto {
    @Field()
    id: number;

    @Field()
    applicationId: number;
    
    @Field()
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

    @Field({nullable: true})
    @IsDate()
    effectiveEndDate: Date;

    @Field()
    isMinistry: boolean;
}

@InputType()
export class AppParticipantsInputDto {
    @Field()
    id: number;

    @Field()
    applicationId: number;
    
    @Field()
    isMainParticipant: boolean;

    @Field()
    @IsString()
    firstName: string;

    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    description: string;

    @Field()
    @IsDate()
    effectiveStartDate: Date;

    @Field({nullable: true})
    @IsDate()
    effectiveEndDate: Date;

    @Field()
    isMinistry: boolean;
}
