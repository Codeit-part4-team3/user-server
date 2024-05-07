import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PlanService {
  constructor(private prismaService: PrismaService) {}

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
