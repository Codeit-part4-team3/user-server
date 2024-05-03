import { Module } from '@nestjs/common';

import { PasswordController } from './password.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { KakaoService } from './kakao.service';
import { KakaoController } from './kakao.controller';

@Module({
  controllers: [AuthController, PasswordController, KakaoController],
  providers: [AuthService, UserService, PrismaService, KakaoService],
})
export class AuthModule {}
