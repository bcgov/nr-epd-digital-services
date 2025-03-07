import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericResponseProvider } from '../../dto/reponse/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import { ApplicationHousingDto } from '../../dto/applicationHousingDto';
import { ApplicationHousingService } from '../../services/application/applicationHousing.service';
import { ApplicationHousingResponse } from '../../dto/reponse/applicationHousingResponse';

@Resolver(() => ApplicationHousingDto)
export class ApplicationHousingResolver {
  constructor(
    private readonly applicationHousingService: ApplicationHousingService,
    private readonly genericResponseProvider: GenericResponseProvider<
      ApplicationHousingDto[]
    >,
  ) {}

  @Query(() => ApplicationHousingResponse, {
    name: 'getApplicationHousingByApplicationId',
  })
  @UsePipes(new GenericValidationPipe())
  async getApplicationHousingByApplicationId(
    @Args('applicationId', { type: () => Int }) applicationId: number,
  ) {
    const result =
      await this.applicationHousingService.getApplicationHousingByApplicationId(
        applicationId,
      );

    return this.genericResponseProvider.createResponse(
      'Application housing fetched successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }
}
