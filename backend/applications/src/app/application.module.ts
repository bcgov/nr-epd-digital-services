import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './controllers/form.controller';
import { IntakeController } from './controllers/intake.controller';
import { FormService } from './services/form.service';
import { Form } from './entities/form.entity';
import { CatsService } from './services/cats.service';
import { ChefsService } from './services/chefs.service';
import { IntakeService } from './services/intake.service';

@Module({
  imports: [TypeOrmModule.forFeature([Form])],
  providers: [
    FormService,
    CatsService,
    ChefsService,
    IntakeService,
  ],
  controllers: [FormController, IntakeController],
})
export class ApplicationModule { }
