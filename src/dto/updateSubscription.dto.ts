import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSubscriptionDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  planId: number;
}
