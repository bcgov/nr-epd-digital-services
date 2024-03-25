import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Module for wrapping all functionalities in sites microserivce
 */
@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [],
})
export class SitesModule { }
