import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PrismaService } from '../prisma.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Module({
  providers: [PlanService, PrismaService, AuthService, UserService],
  controllers: [PlanController],
})
export class PlanModule {}
