import { Field, InputType } from '@nestjs/graphql';
import { BasePerson } from './basePerson.dto';

// DTO for creating a person
@InputType()
export class CreatePerson extends BasePerson {
    @Field({nullable:true})
    createdBy: string;
  
    @Field({nullable: true})
    createdDatetime: Date;
  
    // @Field({ nullable: true })
    // ts: Buffer | null;
}
