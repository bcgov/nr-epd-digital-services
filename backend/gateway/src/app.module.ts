import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { IntrospectAndCompose } from '@apollo/gateway';
import { RequestHandler } from './RequestHandler';


const handleAuth = ({ req }) => {

  // console.log('at server ', new Date(), req)

  try {
    if (req.headers.authorization) {
      // const token = getToken(req.headers.authorization);
      // const decoded: any = decodeToken(token);
      return {
        userAuthToken: req.headers.authorization
      };
    }
  } catch (err) {
    //throw new UnauthorizedException('User unauthorized with invalid authorization Headers');
  }
};


@Module({
  imports: [ 
    // KeycloakConnectModule.register({
    //   authServerUrl: 'https://epd-keycloak-dev.apps.silver.devops.gov.bc.ca/auth',
    //   realm: 'epd-dev',
    //   clientId: 'backend',
    //   secret: '06777f04-8056-4318-b59c-3f1057555af3',
      
    //   // Secret key of the client taken from keycloak server
    // }),

  //    TypeOrmModule.forRoot({
  //   type: 'postgres',
  //   host: process.env.POSTGRESQL_HOST || 'gldatabase',
  //   port: parseInt(<string>process.env.POSTGRESQL_PORT) || 5432,
  //   database: process.env.POSTGRESQL_DATABASE || 'admin',
  //   username: process.env.POSTGRESQL_USER || 'admin',
  //   password: process.env.POSTGRESQL_PASSWORD || 'admin',
  //   // entities: [User],
  //   autoLoadEntities:
  //     process.env.POSTGRESQL_AUTOLOAD_ENTITIES == 'false' ? false : true, // Auto load all entities regiestered by typeorm forFeature method.
  //   synchronize: process.env.POSTGRESQL_SYNC == 'false' ? false : true, // This changes the DB schema to match changes to entities, which we might not want.
  // }),
//  GraphQLModule.forRoot({
//   driver:ApolloDriver,
//   autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
//  })],
GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
  driver: ApolloGatewayDriver,
  server: {
    // ... Apollo server options
    cors: true,

    context: handleAuth,

    formatResponse(response, requestContext) {   

      for(var key in response.data)
      {
        if(response.data[key].httpStatusCode!=null && response.data[key].httpStatusCode!=undefined)
        {
          requestContext.response.http.status =response.data[key].httpStatusCode;
        }
      }

      
      //requestContext.response.http.headers.append("code","201");

 
      return response;
    },
  }
  ,
 
  gateway: {
    buildService: ({ url }) => new RequestHandler({ url }),
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'users', url: 'http://users:3005/graphql' },
        { name: 'applications', url: 'http://applications:3006/graphql' },
      ],
    }),
  },})],

  controllers: [AppController],
  providers: [AppService, 
  //   {
  //   provide: APP_GUARD,     
  //   useClass: AuthGuard,
  // },
  // {
  //   provide: APP_GUARD,
  //   useClass: ResourceGuard,
  // },
  // {
  //   provide: APP_GUARD,
  //   useClass: RoleGuard,
  // }
],
})
export class AppModule {}
