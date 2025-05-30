import { InputType, Field, Int } from '@nestjs/graphql';
import { BasePerson} from './basePerson.dto';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdatePerson extends BasePerson {
    @Field()
    id: number;

    @Field( { nullable: true })
    @IsOptional()
    updatedBy: string | null;
  
    @Field({ nullable: true })
    @IsOptional()
    updatedDatetime: Date | null;

    @Field(() => [Int], { defaultValue: [], nullable: true })
    @IsOptional()
    permissionIds?: number[] | null;
}
