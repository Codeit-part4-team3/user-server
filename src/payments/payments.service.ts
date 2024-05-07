import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { v4 as uuidv4 } from 'uuid';
import { TempOrdersService } from './tempOrders.service';
import { CardIssuerCode, CardIssuerName } from './config/payment.config';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly tossUrl = 'https://api.tosspayments.com/v1/payments/confirm';
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  constructor(
    private readonly tempOrdersService: TempOrdersService,
    private readonly prismaService: PrismaService,
  ) {}

  // 결제
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { userId, planId, orderId, amount, paymentKey } = confirmPaymentDto;
    const idempotency = uuidv4(); // 멱등키 생성

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
          HttpStatus.BAD_GATEWAY,
        );
      }

      // 결제 수단
      const method = response.data.method;
      let paymentMethod: string;

      switch (method) {
        case '카드':
          // 발급사 코드에 따른 발급사명 리턴
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

      // 결제 수단 저장
      const paymentMethodRecord = await this.createPaymentMethod(
        userId,
        paymentMethod,
        response.data.billingKey,
      );

      // 구독 데이터 저장
      const subscriptionRecord = await this.createSubscription(
        userId,
        planId,
        response.data,
      );

      // 결제 데이터 저장
      const paymentRecord = await this.savePaymentDetails(
        subscriptionRecord.id,
        userId,
        planId,
        paymentMethodRecord.id,
        response.data,
      );

      return {
        title: '결제 성공',
        paymentMethod,
        paymentRecord,
        data: response.data,
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

  // 결제 수단 저장
  async createPaymentMethod(userId: number, type: string, billingKey: any) {
    return await this.prismaService.paymentMethod.create({
      data: {
        userId,
        type,
        billingKey,
      },
    });
  }

  // 구독 저장
  async createSubscription(userId: number, planId: number, responseData: any) {
    return await this.prismaService.subscription.create({
      data: {
        userId,
        planId,
        isActive: true,
        startDate: new Date(responseData.approvedAt),
        endDate: new Date(responseData.approvedAt),
        paymentCycle: 'IRREGULAR',
      },
    });
  }

  // 결제내역 저장
  async savePaymentDetails(
    userId: number,
    planId: number,
    subscriptionId: number,
    paymentMethodId: number,
    responseData: any,
  ) {
    return await this.prismaService.payment.create({
      data: {
        userId,
        planId,
        subscriptionId: subscriptionId,
        paymentMethodId,
        amount: responseData.totalAmount,
        status: responseData.status,
        createdAt: new Date(responseData.approvedAt),
      },
    });
  }
}
