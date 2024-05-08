import { IsNotEmpty, IsString } from 'class-validator';

export class CancelPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  cancelReason: string;
}
