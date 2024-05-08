import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('plans')
@Controller('/user/v1/plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get('all')
  async getAllPlans() {
    return await this.planService.getAllPlans();
  }

  @Get(':planId')
  async getPlan(@Param('planId', ParseIntPipe) planId: number) {
    return await this.planService.getPlanByPlanId(planId);
  }
}
