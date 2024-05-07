import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @IsString()
  @IsNotEmpty()
  paymentKey: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
