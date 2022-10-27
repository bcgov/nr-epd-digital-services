import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportInput } from './dto/create-report.input';
import { UpdateReportInput } from './dto/update-report.input';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {

  constructor(@InjectRepository(Report) private reportRepository:Repository<Report>){}

  async create(createReportInput: CreateReportInput) {
    const report = this.reportRepository.create(createReportInput);
    await this.reportRepository.save(report);
    return report;

  }

  async findAll() {
    return this.reportRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportInput: UpdateReportInput) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
