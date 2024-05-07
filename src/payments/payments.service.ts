import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { v4 as uuidv4 } from 'uuid';
import { TempOrdersService } from './tempOrders.service';
import { CardIssuerCode, CardIssuerName } from './config/payment.config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly tossUrl = process.env.TOSS_CONFIRM_URL;
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  constructor(
    private readonly tempOrdersService: TempOrdersService,
    private readonly prismaService: PrismaService,
  ) {}

  // 결제
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { userId, planId, orderId, amount, paymentKey } = confirmPaymentDto;
    const idempotency = uuidv4(); // 멱등키

    try {
      const response = await axios.post(
        `${this.tossUrl}`,
        {
          orderId,
          amount,
          paymentKey,
        },
        {
          headers: {
            Authorization: `Basic ${btoa(`${this.secretKey}:`)}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `${idempotency}`,
          },
        },
      );

      // 가주문 테이블과 비교
      const tempOrdersData =
        await this.tempOrdersService.getTempOrdersData(orderId);
      const { tempOrderId, totalAmount } = tempOrdersData;

      if (response.data.orderId !== tempOrderId) {
        throw new HttpException(
          '주문 ID가 예상 값과 일치하지 않습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (response.data.totalAmount !== totalAmount) {
        throw new HttpException(
          '결제 총액이 예상 금액과 일치하지 않습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 결제 수단
      const method = response.data.paymentMethod;
      let paymentMethod: string;
      switch (method) {
        case '카드':
          const issuerCode: CardIssuerCode = response.data.card.issuerCode;
          paymentMethod = CardIssuerName[issuerCode];
          break;
        case '간편결제':
          paymentMethod = response.data.easyPay.provider;
          break;
        case '휴대폰':
          paymentMethod = response.data.method;
          break;
        default:
          paymentMethod = '알 수 없음';
          break;
      }

      // 구독 데이터 저장
      const subscriptionRecord = await this.createSubscription(
        userId,
        planId,
        response.data.approvedAt,
        response.data.approvedAt,
        true,
        'IRREGULAR',
      );

      // 결제 데이터 저장
      const paymentRecord = await this.createPaymentDetails(
        userId,
        planId,
        subscriptionRecord.id,
        response.data.totalAmount,
        response.data.status,
        response.data.approvedAt,
      );

      return {
        title: '결제 성공',
        paymentMethod,
        paymentRecord,
      };
    } catch (err) {
      const customErrorResponse = {
        code: err.response.data.code,
        message: err.response.data.message,
      };
      throw new HttpException(
        customErrorResponse,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSubscriptionsByUserId(userId: number) {
    if (!userId) {
      throw new HttpException('userId는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    try {
      const subscriptions = await this.prismaService.subscription.findMany({
        where: { userId },
        include: {
          plan: true,
        },
      });
      return subscriptions;
    } catch (error) {
      console.error('Error retrieving subscriptions:', error);
      throw new HttpException(
        'Failed to retrieve subscriptions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSubscription(
    userId: number,
    planId: number,
    startDate: Date,
    endDate: Date,
    isActive: boolean,
    paymentCycle: string,
  ) {
    try {
      const response = await this.prismaService.subscription.create({
        data: {
          userId,
          planId,
          startDate: startDate,
          endDate: endDate,
          isActive: isActive,
          paymentCycle: paymentCycle,
        },
      });
      return response;
    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw new HttpException(
        'Subscription creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPaymentsByUserId(userId: number) {
    if (!userId) {
      throw new HttpException('userId는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    try {
      const payments = await this.prismaService.payment.findMany({
        where: { userId },
        include: {
          user: true, // 사용자 정보도 함께 가져오고 싶다면 이렇게 설정
          plan: true, // 결제한 플랜 정보도 가져올 수 있음
          subscription: true, // 연관된 구독 정보도 함께 가져올 수 있음
        },
      });
      return payments;
    } catch (error) {
      console.error('Error retrieving payments:', error);
      throw new HttpException(
        'Failed to retrieve payments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPaymentDetails(
    userId: number,
    planId: number,
    subscriptionId: number,
    amount: number,
    status: string,
    createdAt: Date,
  ) {
    try {
      const response = await this.prismaService.payment.create({
        data: {
          userId,
          planId,
          subscriptionId,
          amount: amount,
          status: status,
          createdAt: new Date(createdAt),
        },
      });
      return response;
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new HttpException(
        'Payment creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
