import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PlanService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
  ) {}

  // 모든 플랜 조회
  async getAllPlans() {
    try {
      const plans = await this.prismaService.plan.findMany();

      return plans;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve plan data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 플랜 ID로 플랜 정보 조회
  async getPlanByPlanId(planId: number) {
    try {
      const plan = await this.prismaService.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new HttpException('Plan not found', HttpStatus.NOT_FOUND);
      }

      return plan;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve plan data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
