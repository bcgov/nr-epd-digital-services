import { InputType, Field } from '@nestjs/graphql';
import { CreateApplication } from './createApplication.dto';

@InputType()
export class UpdateApplication extends CreateApplication { }