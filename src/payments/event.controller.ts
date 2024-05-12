import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './../auth/jwt-auth-guard';
import { EventService } from './event.service';
import { AdminGuard } from 'src/auth/admin-guard';
import { AmountDto } from 'src/dto/amount.dto';

@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth('accessToken')
@ApiTags('payments')
@Controller('/user/v1/payments')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  //누적 금액 생성
  @Post('event')
  createEventAmount(@Body() amountDto: AmountDto) {
    return this.eventService.createEventAmount(amountDto);
  }

  // 누적 금액 조회
  @Get('event')
  getEventAmount() {
    return this.eventService.getEventAmount();
  }

  //누적 금액 삭제
  @Delete('event')
  deleteEventAmount() {
    return this.eventService.deleteEventAmount();
  }
}
