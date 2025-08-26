import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewApplication } from '../../application/viewApplication.dto';
import { ViewApplicationStatus } from '../../application/viewApplicationStatus.dto';

// Response for a note
@ObjectType()
export class ApplicationStatusResponse extends ResponseDto {
  @Field(() => [ViewApplicationStatus], { nullable: true })
  data: ViewApplicationStatus[] | null;
}
