import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에서 데코레이터가 없는 속성을 제거
      forbidNonWhitelisted: true, // 화이트리스트에 없는 속성이 포함된 경우 요청을 거부
      transform: true, // 요청에서 넘어온 데이터를 DTO의 타입으로 변환
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('pq Server')
    .setDescription('pqsoft')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/user/v1', app, document);
  app.enableCors({
    origin: 'https://pqsoft.net/',
  });

  await app.listen(80);
}
bootstrap();
