import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { BasePersonNote } from './basePersonNote.dto';

@InputType()
export class DeletePersonNote {
  @Field()
  @IsUUID()
  id: string; // UUID as the primary key (this will be a string)
}
