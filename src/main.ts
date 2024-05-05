import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);

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
    .addTag('oauth')
    .addTag('forgot')
    .addTag('user')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken', // 이 이름이 스웨거 UI에서 보안 스키마를 참조하는 데 사용됩니다.
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/user/v1', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  app.enableCors({
    origin: ['https://pqsoft.net', 'http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
    allowedHeaders: '*',
  });

  await app.listen(80);
  logger.log('Application is listening on port 80');
}
bootstrap();
