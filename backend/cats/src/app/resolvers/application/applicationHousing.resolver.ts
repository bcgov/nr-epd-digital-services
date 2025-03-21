import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { GenericResponseProvider } from '../../dto/response/genericResponseProvider';
import { GenericValidationPipe } from '../../utils/validations/genericValidationPipe';
import {
  ApplicationHousingDto,
  UpdateHousingInputDto,
} from '../../dto/applicationHousing.dto';
import { ApplicationHousingService } from '../../services/application/applicationHousing.service';
import { ApplicationHousingResponse } from '../../dto/response/applicationHousingResponse';
import { AuthenticatedUser, Unprotected } from 'nest-keycloak-connect';
import { AddHousingInputDto } from '../../dto/applicationHousing.dto';

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

  @Mutation(() => ApplicationHousingResponse, {
    name: 'addHousingToApplication',
  })
  @Unprotected()
  @UsePipes(new GenericValidationPipe())
  async addHousingToApplication(
    @Args('input') input: AddHousingInputDto,
    @AuthenticatedUser() user: any,
  ) {
    const result = await this.applicationHousingService.addHousingToApplication(
      input,
      user,
    );

    return this.genericResponseProvider.createResponse(
      'Housing added to application successfully',
      HttpStatus.CREATED,
      true,
      result,
    );
  }

  @Mutation(() => ApplicationHousingResponse, {
    name: 'updateApplicationHousing',
  })
  @Unprotected()
  @UsePipes(new GenericValidationPipe())
  async updateApplicationHousing(
    @Args('input') input: UpdateHousingInputDto,
    @AuthenticatedUser() user: any,
  ) {
    const result =
      await this.applicationHousingService.updateApplicationHousing(
        input,
        user,
      );

    return this.genericResponseProvider.createResponse(
      'Housing updated successfully',
      HttpStatus.OK,
      true,
      result,
    );
  }
}
