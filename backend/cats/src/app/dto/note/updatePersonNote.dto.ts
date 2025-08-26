import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { BasePersonNote } from './basePersonNote.dto';

@InputType()
export class UpdatePersonNote extends BasePersonNote {}
