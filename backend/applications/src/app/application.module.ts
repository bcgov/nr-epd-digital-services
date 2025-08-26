import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationResolver } from './resolvers/application.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { ExternalUserResolver } from './resolvers/externalUser.resolver';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';
import { Form } from './entities/form.entity';
import { CatsService } from './services/cats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Form])],
  providers: [
    ApplicationResolver,
    ApplicationService,
    ExternalUserResolver,
    FormService,
    CatsService,
  ],
  controllers: [FormController],
})
export class ApplicationModule { }
