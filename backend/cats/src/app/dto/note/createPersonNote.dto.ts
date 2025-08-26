import { Field, InputType } from '@nestjs/graphql';
import { BasePersonNote } from './basePersonNote.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

// DTO for creating a person
@InputType()
export class CreatePersonNote extends BasePersonNote {
  @Field()
  personId: number; // ID of the person related to this note
}
