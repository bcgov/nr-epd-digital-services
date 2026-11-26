import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewApplicationDetails } from '../../application/viewApplicationDetails.dto';

@ObjectType()
export class ApplicationDetailsResponse extends ResponseDto {
  @Field(() => ViewApplicationDetails, { nullable: true })
  data: ViewApplicationDetails | null;
}
