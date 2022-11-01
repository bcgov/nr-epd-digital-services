import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //just for time being added a delayed start
  setTimeout(async ()=>{await app.listen(3010)},10000)  ;
}
bootstrap();
