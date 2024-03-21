import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sites } from './entities/sites.entity';

/**
 * Module for wrapping all functionalities in sites microserivce
 */
@Module({
  imports: [TypeOrmModule.forFeature([Sites])],
  providers: [],
})
export class SitesModule { }
