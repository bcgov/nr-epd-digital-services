import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ColumnConfigDto } from './columnConfig.dto';

@InputType()
export class SaveColumnPreferencesDto {
  @Field()
  @IsString()
  page: string;

  @Field(() => [ColumnConfigDto])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnConfigDto)
  columns: ColumnConfigDto[];
}
