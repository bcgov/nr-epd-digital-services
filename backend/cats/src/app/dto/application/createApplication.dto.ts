import { Field, InputType } from '@nestjs/graphql';

// DTO for creating a person
@InputType()
export class CreateApplication {
    @Field()
    applicationId: number; // ID of the new application in CATS

    @Field()
    srsApplicationId: number; // ID of the new application in SRS

    @Field()
    siteId: number; // site for which the application is created

    @Field()
    appTypeId: number; // the application type eg: SDS, SoSC etc

    @Field()
    receivedDate: Date; // date when application was submitted in SRS
}
