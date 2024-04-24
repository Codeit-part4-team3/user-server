import { Module } from '@nestjs/common';

import { PasswordController } from './password.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [LoggerModule],
  controllers: [AuthController, PasswordController],
  providers: [AuthService, UserService, PrismaService],
})
export class AuthModule {}
