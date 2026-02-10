import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';
import { Form } from './entities/form.entity';
import { CatsService } from './services/cats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  providers: [
    FormService,
    CatsService,
  ],
  controllers: [FormController],
})
export class ApplicationModule { }
