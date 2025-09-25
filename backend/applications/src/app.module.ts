import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './app/application.module';
import { ExternalUser } from './app/entities/externalUser.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    KeycloakConnectModule.registerAsync({
      inject: [ConfigService],
      useFactory: () => ({
        authServerUrl: process.env.KEYCLOCK_AUTH_URL,
        realm: process.env.KEYCLOCK_REALM,
        clientId: process.env.KEYCLOCK_CLIENT_ID,
        secret: process.env.KEYCLOCK_SECRET,
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      }),
      // Secret key of the client taken from keycloak server
    }),
    ApplicationModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRESQL_HOST') || 'gldatabase',
        port: parseInt(config.get('POSTGRESQL_PORT')) || 5432,
        database: config.get('POSTGRES_DATABASE') || 'epd_dev',
        username: config.get('POSTGRES_DB_USERNAME') || 'xyzuser',
        password: config.get('POSTGRES_DB_PASSWORD') || 'xyzuser',
        autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
        synchronize: false,
        schema: config.get('POSTGRES_DB_SCHEMA'),
      }),
      // This changes the DB schema to match changes to entities, which we might not want.
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.POSTGRESQL_HOST || 'gldatabase',
    //   port: parseInt(<string>process.env.POSTGRESQL_PORT) || 5432,
    //   database: process.env.POSTGRESQL_DATABASE || 'admin',
    //   username: process.env.POSTGRESQL_USER || 'admin',
    //   password: process.env.POSTGRESQL_PASSWORD || 'admin',
    //   // entities: [User],
    //   autoLoadEntities: true, // Auto load all entities regiestered by typeorm forFeature method.
    //   synchronize: false, // Auto load all entities regiestered by typeorm forFeature method.
    //   // This changes the DB schema to match changes to entities, which we might not want.
    //   logging: true,
    // }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      // autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      // TODO - Experiment with using old files for localhsot if need be, and true for prod
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [ExternalUser],
      },
      cors: true,
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
