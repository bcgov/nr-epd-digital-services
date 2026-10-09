import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ResponseDto } from './response/response.dto';

@ObjectType()
export class ApplicationLinkDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  confirmationId: string | null;

  @Field(() => String, { nullable: true })
  fileName: string | null;

  @Field(() => String, { nullable: true })
  submittedDate: string | null;

  @Field(() => Int, { nullable: true })
  applicationId: number | null;
}

@ObjectType()
export class ApplicationLinksResponse extends ResponseDto {
  @Field(() => [ApplicationLinkDto])
  data: ApplicationLinkDto[];
}

@ObjectType()
export class ApplicationLinkSearchHitDto {
  @Field(() => Int)
  applicationId: number;

  @Field(() => String, { nullable: true })
  confirmationId: string | null;

  @Field()
  fileName: string;
}

@ObjectType()
export class ApplicationLinkSearchResponse extends ResponseDto {
  @Field(() => [ApplicationLinkSearchHitDto])
  data: ApplicationLinkSearchHitDto[];
}

@InputType()
export class ApplicationLinkInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  targetApplicationId?: number | null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  confirmationId?: string | null;
}

@InputType()
export class SaveApplicationLinksInput {
  @Field(() => Int)
  @IsInt()
  cssaApplicationId: number;

  @Field(() => [ApplicationLinkInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ApplicationLinkInput)
  links: ApplicationLinkInput[];
}
