import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewColumnPreferences } from '../../application/viewColumnPreferences.dto';

@ObjectType()
export class ColumnPreferencesResponse extends ResponseDto {
  @Field(() => ViewColumnPreferences, { nullable: true })
  data: ViewColumnPreferences | null;
}
