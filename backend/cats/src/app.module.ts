import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './app/cats.module';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from './app/filters/customExceptionFilters';
import { MockAuthGuard } from './app/guards/mock-auth.guard';
import { GraphQLAuthExceptionFilter } from './app/filters/graphql-exception.filter';

/**
 * Application Module Wrapping All Functionality For User Micro Service
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KeycloakConnectModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        authServerUrl: config.get('KEYCLOCK_AUTH_URL'),
        realm: config.get('KEYCLOCK_REALM'),
        clientId: config.get('KEYCLOCK_CLIENT_ID'),
        secret: config.get('KEYCLOCK_SECRET'),
      }),
      // Secret key of the client taken from keycloak server config
    }),
    CatsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRESQL_HOST') || 'gldatabase',
        port: parseInt(config.get('POSTGRESQL_PORT')) || 5432,
        database: config.get('POSTGRES_DATABASE') || 'xyz',
        username: config.get('POSTGRES_DB_USERNAME') || 'xyzuser',
        password: config.get('POSTGRES_DB_PASSWORD') || 'xyzuser',
        autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
        synchronize: false,
        schema: config.get('POSTGRES_DB_SCHEMA'),
      }),
      // This changes the DB schema to match changes to entities, which we might not want.
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      // TODO - Experiment with using old files for localhsot if need be, and true for prod
      autoSchemaFile: true,
      cors: {
        credentials: true,
        origin: true,
      },
      context: () => {
        //console.log('req at user '+ new Date(),req)
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: process.env.MOCK_AUTH === 'true' ? MockAuthGuard : AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GraphQLAuthExceptionFilter,
    },
  ],
})
export class AppModule {}
