import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from './response.dto';
import { ApplicationHousingDto } from '../applicationHousingDto';

@ObjectType()
export class ApplicationHousingResponse extends ResponseDto {
  @Field(() => [ApplicationHousingDto])
  data: ApplicationHousingDto[];
}
