import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsDate, IsOptional, IsString } from 'class-validator';

@ObjectType()
@InputType()
export class BaseAppParticipantsDto {
  @Field({ defaultValue: false })
  isMainParticipant: boolean;

  @Field()
  @IsDate()
  effectiveStartDate: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  effectiveEndDate?: Date | null;
}
