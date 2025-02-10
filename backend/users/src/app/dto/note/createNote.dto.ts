import { Field, InputType } from '@nestjs/graphql';
import { BaseNote } from './baseNote.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

// DTO for creating a person
@InputType()
export class CreateNote extends BaseNote {
    @Field()
    personId: string; // ID of the person related to this note
}
