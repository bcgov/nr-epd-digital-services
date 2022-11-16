import { ApolloDriver, ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl:   process.env.KEYCLOCK_AUTH_URL?process.env.KEYCLOCK_AUTH_URL:'ADD YOUR AUTH SERVER URL',
      realm: process.env.KEYCLOCK_REALM? process.env.KEYCLOCK_REALM:'epd-dev',
      clientId: process.env.KEYCLOCK_CLIENT_ID?process.env.KEYCLOCK_CLIENTID:'backend',
      secret: process.env.KEYCLOCK_SECRET?process.env.KEYCLOCK_SECRET:'ADD YOUR SECRET',
      
      // Secret key of the client taken from keycloak server
    }),
    UsersModule,
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
      synchronize: process.env.POSTGRESQL_SYNC == 'false' ? false : true, // This changes the DB schema to match changes to entities, which we might not want.
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    
      driver: ApolloFederationDriver,
    
      // TODO - Experiment with using old files for localhsot if need be, and true for prod
      autoSchemaFile: true,

      cors: {
        credentials: true,
        origin: true,
    },
    context:({req})=>{
      //console.log('req at user '+ new Date(),req)
    }
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
