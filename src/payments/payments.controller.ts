import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UpdateSubscriptionDto } from 'src/dto/updateSubscription.dto';
import { CancelPaymentDto } from 'src/dto/cancelPayment.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
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
    return this.paymentsService.getSubscriptionsByUserId(req.userId);
  }

  @Patch('subscription')
  @ApiBody({ type: UpdateSubscriptionDto })
  updateSubscription(@Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.paymentsService.updateSubscription(
      updateSubscriptionDto.userId,
      updateSubscriptionDto.planId,
    );
  }

  @Get('all')
  getAllPaymentsByUserId(@Request() req) {
    return this.paymentsService.getAllPaymentsByUserId(req.userId);
  }

  @Get(':paymentId')
  getPaymentById(@Param('paymentId', ParseIntPipe) paymentId: number) {
    return this.paymentsService.getPaymentById(paymentId);
  }

  @Post('cancel')
  @ApiBody({ type: CancelPaymentDto })
  cancelPayment(@Body() cancelPaymentDto: CancelPaymentDto) {
    return this.paymentsService.cancelPayment(
      cancelPaymentDto.paymentId,
      cancelPaymentDto.cancelReason,
    );
  }
}
