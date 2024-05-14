import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsDate, IsInt, Min } from 'class-validator';

@InputType()
export class RecentViewDto {

  @Field()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  siteId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  city: string;

  @Field({nullable:true})
  @IsOptional()
  @IsString()
  generalDescription: string | null;

  @Field({nullable:true})
  @IsOptional()
  @IsDate()
  whenUpdated: Date | null;
} 