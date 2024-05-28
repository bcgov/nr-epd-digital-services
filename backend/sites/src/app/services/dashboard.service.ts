import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecentViews } from '../entities/recentViews.entity';
import { Repository } from 'typeorm';
import { RecentViewDto } from '../dto/recentView.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(RecentViews)
    private recentViewsRepository: Repository<RecentViews>,
  ) {}

  async getRecentViewsByUserId(userId: string): Promise<RecentViews[]> {
    try {
      return await this.recentViewsRepository.find({ where: { userId } });
    } catch (error) {
      throw error;
    }
  }

  async addRecentView(recentViewDto: RecentViewDto) {
    const { userId, siteId } = recentViewDto;
    const maxRecentViews = 5; // Maximum allowed recent views per user

    try {
      // Check if the combination of userId and siteId exists in the table
      const existingRecentView = await this.recentViewsRepository.findOne({where: { userId, siteId }});

      if (existingRecentView) {
        // If the combination exists, update the existing record
        existingRecentView.address = recentViewDto.address;
        existingRecentView.city = recentViewDto.city;
        existingRecentView.generalDescription =
          recentViewDto.generalDescription;
        existingRecentView.whenUpdated = recentViewDto.whenUpdated;

        // Explicitly update the 'updated' column
        existingRecentView.updated =  new Date();
        const result = await this.recentViewsRepository.save(existingRecentView);

        if (result) {
          return 'Record is updated successfully.';
        }
      } else {
        // If the combination does not exist, insert a new record
        const existingRecentViewsCount = await this.recentViewsRepository.count({ where: { userId } });

        if (existingRecentViewsCount >= maxRecentViews) {
          // Delete the oldest recent view if the maximum limit is reached
          const oldestRecentView = await this.recentViewsRepository.findOne({
            where: { userId },
            order: { created: 'ASC' },
          });
          await this.recentViewsRepository.delete(oldestRecentView.id);
        }

        // Convert the DTO to entity
        const newRecentView = plainToInstance(RecentViews, recentViewDto);
        const result = await this.recentViewsRepository.save(newRecentView);

        if (result) {
          return 'Record is inserted successfully.';
        }
      }
    } catch (error) {
      throw new Error('Failed to insert or update recent view.');
    }
  }
}
