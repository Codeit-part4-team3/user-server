import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FriendController } from './friend/friend.controller';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    FriendModule,
  ],
  controllers: [UserController, AppController, FriendController],
  providers: [PrismaService, UserService, AppService],
})
export class AppModule {}
