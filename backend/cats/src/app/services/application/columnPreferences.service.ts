import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggerService } from '../../logger/logger.service';
import { SaveColumnPreferencesDto } from '../../dto/application/saveColumnPreferences.dto';
import { ViewColumnPreferences } from '../../dto/application/viewColumnPreferences.dto';
import { UserColumnPreferences } from '../../entities/userColumnPreferences.entity';

@Injectable()
export class ColumnPreferencesService {
  constructor(
    @InjectRepository(UserColumnPreferences)
    private readonly userColumnPreferencesRepository: Repository<UserColumnPreferences>,
    private readonly loggerService: LoggerService,
  ) {}

  async getUserColumnPreferences(
    userId: string,
    page: string,
  ): Promise<ViewColumnPreferences | null> {
    try {
      this.loggerService.log(
        `ColumnPreferencesService.getUserColumnPreferences() start - userId: ${userId}, page: ${page}`,
      );

      const preferences = await this.userColumnPreferencesRepository.findOne({
        where: { userId, page },
      });

      if (!preferences) {
        this.loggerService.log(
          `ColumnPreferencesService.getUserColumnPreferences() - No preferences found for userId: ${userId}, page: ${page}`,
        );
        return null;
      }

      const result: ViewColumnPreferences = {
        userId: preferences.userId,
        page: preferences.page,
        columns: preferences.columnConfig,
        createdAt: preferences.createdAt,
        updatedAt: preferences.updatedAt,
      };

      this.loggerService.log(
        `ColumnPreferencesService.getUserColumnPreferences() end - Found preferences for userId: ${userId}`,
      );

      return result;
    } catch (error) {
      this.loggerService.error(
        'ColumnPreferencesService.getUserColumnPreferences() error',
        error,
      );
      throw error;
    }
  }

  async saveUserColumnPreferences(
    userId: string,
    columnPreferences: SaveColumnPreferencesDto,
  ): Promise<ViewColumnPreferences> {
    try {
      this.loggerService.log(
        `ColumnPreferencesService.saveUserColumnPreferences() start - userId: ${userId}`,
      );

      let existingPreferences =
        await this.userColumnPreferencesRepository.findOne({
          where: { userId, page: columnPreferences.page },
        });

      if (existingPreferences) {
        existingPreferences.columnConfig = columnPreferences.columns;
        existingPreferences.updatedAt = new Date();

        const savedPreferences =
          await this.userColumnPreferencesRepository.save(existingPreferences);

        this.loggerService.log(
          `ColumnPreferencesService.saveUserColumnPreferences() - Updated existing preferences for userId: ${userId}`,
        );

        return {
          userId: savedPreferences.userId,
          page: savedPreferences.page,
          columns: savedPreferences.columnConfig,
          createdAt: savedPreferences.createdAt,
          updatedAt: savedPreferences.updatedAt,
        };
      } else {
        const newPreferences = this.userColumnPreferencesRepository.create({
          userId,
          page: columnPreferences.page,
          columnConfig: columnPreferences.columns,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedPreferences =
          await this.userColumnPreferencesRepository.save(newPreferences);

        this.loggerService.log(
          `ColumnPreferencesService.saveUserColumnPreferences() - Created new preferences for userId: ${userId}`,
        );

        return {
          userId: savedPreferences.userId,
          page: savedPreferences.page,
          columns: savedPreferences.columnConfig,
          createdAt: savedPreferences.createdAt,
          updatedAt: savedPreferences.updatedAt,
        };
      }
    } catch (error) {
      this.loggerService.error(
        'ColumnPreferencesService.saveUserColumnPreferences() error',
        error,
      );
      throw error;
    }
  }
}
