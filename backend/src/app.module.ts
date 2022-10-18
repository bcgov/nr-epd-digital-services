import "dotenv/config";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { WinstonModule } from "nest-winston";
import { Logger } from "./logging/logger";
import { AppLoggerMiddleware } from "./logging/loggerMiddleware";
import { GraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { ApolloDriver } from "@nestjs/apollo";
import { ApplicationsModule } from './applications/applications.module';
import { AuthGuard, KeycloakConnectModule, ResourceGuard, RoleGuard } from "nest-keycloak-connect";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl:  process.env.KEYCLOCK_AUTH_SERVER ||'https://epd-keycloak-dev.apps.silver.devops.gov.bc.ca/auth',
      realm: process.env.KEYCLOCK_REALM || 'epd-dev',
      clientId: process.env.KEYCLOCK_CLIENT_ID ||'backend',
      secret: process.env.KEYCLOCK_CLIENT_SECRET || '06777f04-8056-4318-b59c-3f1057555af3',
      
      // Secret key of the client taken from keycloak server
    }),
    WinstonModule.forRoot(Logger.WinstonLogger()),
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRESQL_HOST || "localhost",
      port: parseInt(<string>process.env.POSTGRESQL_PORT) || 5432,
      database: process.env.POSTGRESQL_DATABASE || "postgres",
      username: process.env.POSTGRESQL_USER || "postgres",
      password: process.env.POSTGRESQL_PASSWORD,
      // entities: [User],
      autoLoadEntities:
        process.env.POSTGRESQL_AUTOLOAD_ENTITIES == "false" ? false : true, // Auto load all entities regiestered by typeorm forFeature method.
      synchronize: process.env.POSTGRESQL_SYNC == "false" ? false : true, // This changes the DB schema to match changes to entities, which we might not want.
    }),
    UsersModule,
    GraphQLModule.forRoot(
      {
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(),'src/graphql-schema.gql'),

      }
    ),
    ApplicationsModule
  ],
  controllers: [AppController],
  providers: [AppService,
  // This adds a global level authentication guard,
    // you can also have it scoped
    // if you like.
    //
    // Will return a 401 unauthorized when it is unable to
    // verify the JWT token or Bearer header is missing.
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    // This adds a global level resource guard, which is permissive.
    // Only controllers annotated with @Resource and 
    // methods with @Scopes
    // are handled by this guard.
    {
      provide: APP_GUARD,
      useClass: ResourceGuard,
    },
    // New in 1.1.0
    // This adds a global level role guard, which is permissive.
    // Used by `@Roles` decorator with the 
    // optional `@AllowAnyRole` decorator for allowing any
    // specified role passed.
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    /* Uncomment the following line to enable request logging for all routes */
    //consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
