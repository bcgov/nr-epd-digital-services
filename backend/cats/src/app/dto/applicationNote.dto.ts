import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from './response/response.dto';

@ObjectType()
export class AppNoteDto {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  applicationId: number;

  @Field()
  noteDate: string;

  @Field()
  noteText: string;

  @Field()
  createdBy: string;

  @Field(() => Date)
  createdDateTime: Date;

  @Field()
  updatedBy: string;

  @Field(() => Date)
  updatedDateTime: Date;
}

@ObjectType()
export class ApplicationNotesResponse extends ResponseDto {
  @Field(() => [AppNoteDto])
  data: AppNoteDto[];
}
