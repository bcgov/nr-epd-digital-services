import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as waitOn from 'wait-on';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  console.log(
    ' process.env.USERS_MICROSERVICE ',
    process.env.USERS_MICROSERVICE,
  );

  waitOn({
    resources: [
      process.env.USERS_MICROSERVICE
        ? process.env.USERS_MICROSERVICE
        : 'http://users:3005',
    ],
    interval: 100,
    timeout: 180000,
    validateStatus: function (status) {
      console.log('status', status);
      return status == 200;
    },
  })
    .then(async () => {
      console.log('users service up');

      const app = await NestFactory.create(AppModule);
      await app.listen(3010);
      //just for time being added a delayed start
    })
    .catch((error) => {
      console.log(error);
    });
}

bootstrap();
