import { Field, InputType, Int } from '@nestjs/graphql';
import { BasePerson } from './basePerson.dto';
import { IsOptional } from 'class-validator';

// DTO for creating a person
@InputType()
export class CreatePerson extends BasePerson {
    @Field({nullable:true})
    createdBy: string;
  
    @Field({nullable: true})
    createdDatetime: Date;

    @Field(() => [Int], { defaultValue: [], nullable: true })
    @IsOptional()
    permissionIds?: number[] | null;
}
