import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as waitOn from 'wait-on';

async function bootstrap() {

  waitOn({
    resources: ['http://users:3005'],
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
