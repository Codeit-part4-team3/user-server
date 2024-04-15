import { Module } from '@nestjs/common';

import { PasswordController } from './password.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AuthController, PasswordController],
  providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
