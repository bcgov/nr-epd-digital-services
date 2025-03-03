import { Field, ObjectType } from '@nestjs/graphql';
import { ViewPerson } from '../../person/viewPerson.dto';
import { PagedResponseDto } from '../response.dto';

@ObjectType()
export class SearchPersonResponse extends PagedResponseDto {
  @Field(() => [ViewPerson])
  persons: ViewPerson[];
}
