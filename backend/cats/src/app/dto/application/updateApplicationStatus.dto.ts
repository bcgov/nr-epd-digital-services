import { InputType, Field } from '@nestjs/graphql';
import { PickType } from '@nestjs/graphql';
import { ApplicationStatusDto } from './applicationStatus.dto';

@InputType()
export class UpdateApplicationStatusDto extends PickType(ApplicationStatusDto, [
    'formId',
    'submissionId',
    'formsflowAppId',
]) { }