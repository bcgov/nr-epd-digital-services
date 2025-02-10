import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { BaseNote } from './baseNote.dto';

@InputType()
export class UpdateNote extends BaseNote {
  
  @Field()
  @IsUUID()
  noteId: string; // UUID as the primary key (this will be a string)

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  user: string | null; // Optional field for who updated the note
  
  @Field({ nullable: true })
  date: Date | null; // Optional field for the updated timestamp
}