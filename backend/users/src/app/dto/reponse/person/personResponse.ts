import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewPerson } from '../../person/viewPerson.dto';

// Response DTO for a person
@ObjectType()
export class PersonResponse extends ResponseDto {
  @Field(() => [ViewPerson])
  data: ViewPerson[] ;
}
