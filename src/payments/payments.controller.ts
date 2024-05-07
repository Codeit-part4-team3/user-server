import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth('accessToken')
@ApiTags('payments')
@Controller('/user/v1/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('confirm')
  @ApiBody({ type: ConfirmPaymentDto })
  confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentsService.confirmPayment(confirmPaymentDto);
  }

  @Get('subscription')
  getSubscriptionsByUserId(@Request() req) {
    return this.paymentsService.getSubscriptionsByUserId(req.user.userId);
  }

  @Get('payments')
  getPaymentsByUserId(@Request() req) {
    return this.paymentsService.getPaymentsByUserId(req.user.userId);
  }
}
