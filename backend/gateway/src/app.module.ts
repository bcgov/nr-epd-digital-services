import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { RequestHandler } from './RequestHandler';

const handleAuth = ({ req }) => {
  try {
    if (req.headers.authorization) {
      // const token = getToken(req.headers.authorization);
      // const decoded: any = decodeToken(token);
      return {
        userAuthToken: req.headers.authorization,
      };
    }
  } catch (err) {
    //throw new UnauthorizedException('User unauthorized with invalid authorization Headers');
  }
};

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      server: {
        // ... Apollo server options
        cors: true,

        context: handleAuth,

        formatResponse(response, requestContext) {
          for (const key in response.data) {
            if (
              response.data[key].httpStatusCode != null &&
              response.data[key].httpStatusCode != undefined
            ) {
              requestContext.response.http.status =
                response.data[key].httpStatusCode;
            }
          }

          //requestContext.response.http.headers.append("code","201");

          return response;
        },
      },
      gateway: {
        buildService: ({ url }) => new RequestHandler({ url }),
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url: process.env.USERS_MICROSERVICE_ENDPOINT
                ? process.env.USERS_MICROSERVICE_ENDPOINT
                : 'http://users:4005/graphql',
            },
            {
              name: 'sites',
              url: process.env.SITE_MICROSERVICE_ENDPOINT
                ? process.env.SITE_MICROSERVICE_ENDPOINT
                : 'http://sites:4007/graphql',
            },
          ],
        }),
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
