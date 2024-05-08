import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TempOrdersService } from './tempOrders.service';
import { CreateTempOrderDto } from '../dto/createTempOrder.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('accessToken')
@ApiTags('payments')
@Controller('/user/v1/payments')
export class TempOrdersController {
  constructor(private readonly tempOrdersService: TempOrdersService) {}

  // 가주문 생성
  @Post('temp-order')
  @ApiBody({ type: CreateTempOrderDto })
  async createTempOrder(@Body() createTempOrderDto: CreateTempOrderDto) {
    try {
      const order =
        await this.tempOrdersService.createTempOrder(createTempOrderDto);
      return order;
    } catch (error) {
      throw new HttpException('Failed to create order', HttpStatus.BAD_REQUEST);
    }
  }
}
