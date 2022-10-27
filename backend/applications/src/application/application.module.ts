import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationResolver } from './application.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { UsersResolver } from './users.resolver';

@Module({
  imports:[TypeOrmModule.forFeature([Application])],
  providers: [ApplicationResolver, ApplicationService,UsersResolver]
})
export class ApplicationModule {}
