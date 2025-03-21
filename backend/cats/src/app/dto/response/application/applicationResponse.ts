import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewApplication } from '../../application/viewApplication.dto';

// Response for a note
@ObjectType()
export class ApplicationResponse extends ResponseDto {
  @Field(() => [ViewApplication], { nullable: true })
  data: ViewApplication[] | null;
}
