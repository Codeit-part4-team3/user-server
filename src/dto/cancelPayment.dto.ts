import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CancelPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  paymentId: number;

  @IsString()
  @IsNotEmpty()
  cancelReason: string;
}
