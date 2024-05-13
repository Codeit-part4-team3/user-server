import { PlanType } from '@prisma/client';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty()
  type: PlanType;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
