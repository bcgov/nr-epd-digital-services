import { Module } from '@nestjs/common';
import { ApplicationService } from './services/application.service';
import { ApplicationResolver } from './resolvers/application.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { UsersResolver } from './resolvers/users.resolver';
import { FormController } from './controllers/form.controller';
import { FormService } from './services/form.service';
import { Form } from './entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Form])],
  providers: [
    ApplicationResolver,
    ApplicationService,
    UsersResolver,
    FormService,
  ],
  controllers: [FormController],
})
export class ApplicationModule {}
