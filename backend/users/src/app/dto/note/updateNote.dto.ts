import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { BaseNote } from './baseNote.dto';

@InputType()
export class UpdateNote extends BaseNote {}