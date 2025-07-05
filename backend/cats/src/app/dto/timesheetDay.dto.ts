import { Field, InputType, Int, ObjectType, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ResponseDto } from './response/response.dto';

@ObjectType()
export class TimesheetDayDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  applicationId: number;

  @Field(() => Int)
  personId: number;

  @Field()
  date: Date;

  @Field(() => Float, { nullable: true })
  hours?: number;

  @Field({ nullable: true })
  comment?: string;
}

@InputType()
export class TimesheetDayUpsertInputDto {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  timesheetDayId?: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  applicationId: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  personId: number;

  @Field()
  @IsNotEmpty()
  date: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  hours?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;
}

@InputType()
export class UpsertTimesheetDaysInputDto {
  @Field(() => [TimesheetDayUpsertInputDto])
  @ValidateNested({ each: true })
  @Type(() => TimesheetDayUpsertInputDto)
  entries: TimesheetDayUpsertInputDto[];
}

@ObjectType()
export class TimesheetDayResponse extends ResponseDto {
  @Field(() => [TimesheetDayDto])
  data: TimesheetDayDto[];
}

@ObjectType()
export class PersonWithTimesheetDaysDto {
  @Field(() => Int)
  personId: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => Int, { nullable: true })
  roleId?: number;

  @Field({ nullable: true })
  roleDescription?: string;

  @Field(() => [TimesheetDayDto])
  timesheetDays: TimesheetDayDto[];
}

@ObjectType()
export class PersonWithTimesheetDaysResponse extends ResponseDto {
  @Field(() => [PersonWithTimesheetDaysDto], { nullable: true })
  data?: PersonWithTimesheetDaysDto[];
}
