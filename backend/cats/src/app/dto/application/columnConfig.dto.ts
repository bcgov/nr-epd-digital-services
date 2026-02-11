import { InputType, ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsString, IsBoolean, IsOptional } from 'class-validator';

@InputType('ColumnConfigInput')
@ObjectType('ColumnConfig')
export class ColumnConfigDto {
  @Field(() => Int)
  @IsNumber()
  id: number;

  @Field()
  @IsString()
  displayName: string;

  @Field()
  @IsBoolean()
  active: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  selectionOrder?: number;
}
