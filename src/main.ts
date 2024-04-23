import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('pq Server')
    .setDescription('pqsoft')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/user/v1', app, document);
  app.enableCors({
    origin: 'https://api.pqsoft.net/',
  });

  await app.listen(80);
}
bootstrap();
