import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewApplication } from '../../application/viewApplication.dto';
import { ViewApplicationDetails } from '../../application/viewApplicationDetails.dto';

// Response for a note
@ObjectType()
export class ApplicationResponse extends ResponseDto {
  @Field(() => [ViewApplication], { nullable: true })
  data: ViewApplication[] | null;
}

@ObjectType()
export class ApplicationDetailsResponse extends ResponseDto {
  @Field(() => ViewApplicationDetails, { nullable: true })
  data: ViewApplicationDetails | null;
}
