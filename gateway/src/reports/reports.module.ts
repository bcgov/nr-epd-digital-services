import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsResolver } from './reports.resolver';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { Report } from './entities/report.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Report])],
  providers: [ReportsResolver, ReportsService]
})
export class ReportsModule {}
