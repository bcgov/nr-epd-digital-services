import { Field, InputType } from '@nestjs/graphql';
import { ApplicationStatusDto } from './applicationStatus.dto';

// DTO for creating a person
@InputType()
export class CreateApplication {
    @Field()
    siteId: number; // site for which the application is created

    @Field()
    appTypeAbbrev: string; // the application type eg: SDS, SoSC etc

    @Field()
    receivedDate: Date; // date when application was submitted in SRS

    @Field(() => [ApplicationStatusDto])
    applicationStatus: ApplicationStatusDto[];

}
