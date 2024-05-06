import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('/user/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('confirm')
  @ApiBody({ type: ConfirmPaymentDto })
  confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(confirmPaymentDto);
  }
}
