import {
  ApolloDriver,
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Inject, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import {
  AuthGuard,
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
      // Secret key of the client taken from keycloak server
    }),
    UsersModule,
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

      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),

      cors: {
        credentials: true,
        origin: true,
      },
      context: ({ req }) => {
        //console.log('req at user '+ new Date(),req)
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
