import { ObjectType, Field } from '@nestjs/graphql';
import { ColumnConfigDto } from './columnConfig.dto';

@ObjectType()
export class ViewColumnPreferences {
  @Field()
  userId: string;

  @Field()
  page: string;

  @Field(() => [ColumnConfigDto])
  columns: ColumnConfigDto[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
