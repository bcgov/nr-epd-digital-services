import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HttpStatus, UsePipes } from '@nestjs/common';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import { GenericValidationPipe } from '../../utilities/validations/genericValidationPipe';
import { LoggerService } from '../../logger/logger.service';
import { ColumnPreferencesService } from '../../services/application/columnPreferences.service';
import { SaveColumnPreferencesDto } from '../../dto/application/saveColumnPreferences.dto';
import { ViewColumnPreferences } from '../../dto/application/viewColumnPreferences.dto';
import { ColumnPreferencesResponse } from '../../dto/response/application/columnPreferencesResponse';

@Resolver()
export class ColumnPreferencesResolver {
  constructor(
    private readonly columnPreferencesService: ColumnPreferencesService,
    private readonly loggerService: LoggerService,
  ) {}

  @Query(() => ColumnPreferencesResponse, { name: 'getUserColumnPreferences' })
  async getUserColumnPreferences(
    @AuthenticatedUser() user: any,
    @Args('page') page: string,
  ): Promise<ColumnPreferencesResponse> {
    try {
      this.loggerService.log(
        `ColumnPreferencesResolver.getUserColumnPreferences() start - userId: ${user?.sub}, page: ${page}`,
      );

      const result =
        await this.columnPreferencesService.getUserColumnPreferences(
          user?.sub,
          page,
        );

      if (result) {
        this.loggerService.log(
          'ColumnPreferencesResolver.getUserColumnPreferences() RES:200 end',
        );
        return {
          message: 'Column preferences retrieved successfully',
          httpStatusCode: HttpStatus.OK,
          success: true,
          timestamp: new Date().toISOString(),
          data: result,
        };
      } else {
        this.loggerService.log(
          'ColumnPreferencesResolver.getUserColumnPreferences() RES:404 end',
        );
        return {
          message: 'No column preferences found',
          httpStatusCode: HttpStatus.NOT_FOUND,
          success: false,
          timestamp: new Date().toISOString(),
          data: null,
        };
      }
    } catch (error) {
      this.loggerService.error(
        'ColumnPreferencesResolver.getUserColumnPreferences() error',
        error,
      );
      return {
        message: 'Error retrieving column preferences',
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
      };
    }
  }

  @Mutation(() => ColumnPreferencesResponse, {
    name: 'saveUserColumnPreferences',
  })
  @UsePipes(new GenericValidationPipe())
  async saveUserColumnPreferences(
    @AuthenticatedUser() user: any,
    @Args('columnPreferences', { type: () => SaveColumnPreferencesDto })
    columnPreferences: SaveColumnPreferencesDto,
  ): Promise<ColumnPreferencesResponse> {
    try {
      this.loggerService.log(
        `ColumnPreferencesResolver.saveUserColumnPreferences() start - userId: ${user?.sub}` +
          JSON.stringify(columnPreferences),
      );

      const result =
        await this.columnPreferencesService.saveUserColumnPreferences(
          user?.sub,
          columnPreferences,
        );

      if (result) {
        this.loggerService.log(
          'ColumnPreferencesResolver.saveUserColumnPreferences() RES:201 end',
        );
        return {
          message: 'Column preferences saved successfully',
          httpStatusCode: HttpStatus.CREATED,
          success: true,
          timestamp: new Date().toISOString(),
          data: result,
        };
      } else {
        this.loggerService.log(
          'ColumnPreferencesResolver.saveUserColumnPreferences() RES:400 end',
        );
        return {
          message: 'Failed to save column preferences',
          httpStatusCode: HttpStatus.BAD_REQUEST,
          success: false,
          timestamp: new Date().toISOString(),
          data: null,
        };
      }
    } catch (error) {
      this.loggerService.error(
        'ColumnPreferencesResolver.saveUserColumnPreferences() error',
        error,
      );
      return {
        message: 'Error saving column preferences',
        httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        timestamp: new Date().toISOString(),
        data: null,
      };
    }
  }
}
