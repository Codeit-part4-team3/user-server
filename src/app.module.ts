import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FriendModule } from './friend/friend.module';
import { LoggerModule } from './common/logger/logger.module';
import { LoggingMiddleware } from './common/logger/logger.middleware';
import { AuthService } from './auth/auth.service';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [
    LoggerModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FriendModule,
    InternalModule,
  ],
  controllers: [UserController, AppController],
  providers: [PrismaService, UserService, AppService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*'); // 모든 라우트에 미들웨어를 적용
  }
}
