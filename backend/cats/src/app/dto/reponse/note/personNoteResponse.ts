import { Field, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from '../response.dto';
import { ViewPersonNote } from '../../note/viewPersonNote.dto';

// Response for a note
@ObjectType()
export class PersonNoteResponse extends ResponseDto {
  @Field(() => [ViewPersonNote], { nullable: true })
  data: ViewPersonNote[] | null;
}
