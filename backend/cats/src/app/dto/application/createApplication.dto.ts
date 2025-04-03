import { Field, InputType } from '@nestjs/graphql';

// DTO for creating a person
@InputType()
export class CreateApplication {
    @Field()
    formId: string; // the formId in formsflow

    @Field()
    submissionId: string; // the submission id in formsflow

    @Field()
    siteId: number; // site for which the application is created

    @Field()
    appTypeAbbrev: string; // the application type eg: SDS, SoSC etc

    @Field()
    receivedDate: Date; // date when application was submitted in SRS
}
