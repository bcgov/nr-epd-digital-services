import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ResponseDto } from './response/response.dto';

@ObjectType()
export class ApplicationLinkDto {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  confirmationId: string | null;

  @Field(() => String, { nullable: true })
  fileName: string | null;

  @Field(() => String, { nullable: true })
  submittedDate: string | null;

  @Field(() => Int, { nullable: true })
  applicationId: number | null;
}

@ObjectType()
export class ApplicationLinksResponse extends ResponseDto {
  @Field(() => [ApplicationLinkDto])
  data: ApplicationLinkDto[];
}
