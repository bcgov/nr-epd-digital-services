import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GenericResponse } from './response/genericResponse';

@ObjectType()
export class HousingTypeDto {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  abbrev: string;

  @Field()
  description: string;

  @Field()
  isActive: boolean;

  @Field(() => Int)
  displayOrder: number;
}

@ObjectType()
export class HousingTypeResponse extends GenericResponse<HousingTypeDto[]> {
  @Field(() => [HousingTypeDto])
  data: HousingTypeDto[];
}
