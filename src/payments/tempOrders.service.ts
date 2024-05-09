// temp-orders.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TempOrdersService {
  constructor(private prismaService: PrismaService) {}

  // 주문 ID 생성
  generateRandomOrderId(length: number): string {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_=';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
    return randomString;
  }

  // 가주문 생성
  async createTempOrder(orderData: { orderName: string; totalAmount: number }) {
    const tempOrderId = this.generateRandomOrderId(25); // 주문 ID
    try {
      const order = await this.prismaService.tempOrder.create({
        data: {
          tempOrderId,
          ...orderData,
        },
      });
      return order;
    } catch (error) {
      throw new HttpException(
        'Failed to create temporary order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 가주문 조회(실주문과 대조용도)
  async getTempOrdersData(orderId: string) {
    try {
      const order = await this.prismaService.tempOrder.findUnique({
        where: { tempOrderId: orderId },
      });
      if (!order) {
        throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
      }
      return order;
    } catch (error) {
      throw new HttpException(
        'Failed to retrieve order data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 가주문 삭제
  async deleteTempOrder(orderId: string) {
    try {
      const order = await this.prismaService.tempOrder.delete({
        where: { tempOrderId: orderId },
      });
      return order;
    } catch (error) {
      throw new HttpException(
        'Failed to delete temporary order',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
