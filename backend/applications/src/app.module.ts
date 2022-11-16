import { ApolloDriver, ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule, GraphQLFederationFactory } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard, KeycloakConnectModule, PolicyEnforcementMode, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { ApplicationResolver } from './application/application.resolver';
import { ApplicationService } from './application/application.service';
import { User } from './application/entities/user.entity';
import { UsersResolver } from './application/users.resolver';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl:   process.env.KEYCLOCK_AUTH_URL?process.env.KEYCLOCK_AUTH_URL:'ADD YOUR AUTH SERVER URL',
      realm:  process.env.KEYCLOCK_REALM? process.env.KEYCLOCK_REALM:'epd-dev',
      clientId:  process.env.KEYCLOCK_CLIENT_ID?process.env.KEYCLOCK_CLIENTID:'backend',
      secret:  process.env.KEYCLOCK_SECRET?process.env.KEYCLOCK_SECRET:'ADD YOUR SECRET',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      // Secret key of the client taken from keycloak server
    }),
        ApplicationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRESQL_HOST || 'gldatabase',
      port: parseInt(<string>process.env.POSTGRESQL_PORT) || 5432,
      database: process.env.POSTGRESQL_DATABASE || 'admin',
      username: process.env.POSTGRESQL_USER || 'admin',
      password: process.env.POSTGRESQL_PASSWORD || 'admin',
      // entities: [User],
      autoLoadEntities:
        process.env.POSTGRESQL_AUTOLOAD_ENTITIES == 'false' ? false : true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: process.env.POSTGRESQL_SYNC == 'false' ? false : true, 
      // This changes the DB schema to match changes to entities, which we might not want.
      logging:true
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig> ({
      driver: ApolloFederationDriver,
      // autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      // TODO - Experiment with using old files for localhsot if need be, and true for prod
      autoSchemaFile: true,
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
      cors:true
    }),
  ],

  controllers: [AppController],
  providers: [AppService,
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
    }
  ],
})
export class AppModule {}
