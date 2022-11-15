import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //const whitelist = ['submit.digital.gov.bc.ca']
  app.enableCors({
    // origin:function (origin, callback) {
    //   if (!origin || whitelist.indexOf(origin) !== -1) {
    //     callback(null, true)
    //   } else {
    //     callback(new Error('Not allowed by CORS'))
    //   }
    // } ,
    origin:true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
});
  await app.listen(3005);
}
bootstrap();
