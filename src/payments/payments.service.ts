import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { v4 as uuidv4 } from 'uuid';
import { TempOrdersService } from './tempOrders.service';
import { CardIssuerCode, CardIssuerName } from './config/payment.config';
import { PrismaService } from 'src/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class PaymentsService {
  private readonly tossUrl = process.env.TOSS_PAYMENTS_URL;
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  constructor(
    private readonly tempOrdersService: TempOrdersService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   * 결제 승인 후 처리 과정을 수행
   * 1. toss 서버에 결제 승인 요청을 보냄
   * 2. toss 서버에서 결제 승인 응답을 받음
   * 3. 결제 완료 응답 데이터를 가주문(tempOrders) 테이블과 비교
   * 4. 결제 완료 응답 데이터를 구독(subscriptions) 테이블에 저장
   * 5. 결제 완료 응답 데이터를 결제내역(payments) 테이블에 저장
   *
   * @param {ConfirmPaymentDto} confirmPaymentDto - 결제 승인 요청 데이터
   * @returns {Promise<PaymentResponseDto>} 결제 처리 결과를 반환
   */
  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const { userId, planId, orderId, amount, paymentKey } = confirmPaymentDto;
    const idempotency = uuidv4(); // 멱등키

    try {
      const response = await axios.post(
        `${this.tossUrl}/confirm`,
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

      // 가주문과 비교
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
      const method = response.data.method;
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

      const subscription = await this.getSubscriptionsByUserId(userId);

      if (subscription) {
        // 기존 구독이 있을 경우 업데이트
        await this.updateSubscription(userId, planId);
      } else {
        // 기존 구독이 없을 경우 생성
        await this.createSubscription(
          userId,
          planId,
          new Date(response.data.approvedAt),
          true,
        );
      }

      // 결제 데이터 저장
      const payment = await this.createPayment(
        userId,
        planId,
        response.data.totalAmount,
        response.data.status,
        paymentKey,
        new Date(response.data.approvedAt),
      );

      return {
        title: '결제 성공',
        paymentMethod,
        payment,
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

  /**
   * 서비스에서 사용할 결제 관련 기능 구현
   * 1. 구독 조회
   * 2. 구독 생성
   * 3. 구독 업데이트
   * 4. 결제내역 조회
   * 5. 결제내역 생성
   * 6. 환불내역 생성
   * 7. 매일 자정 만료 구독 비활성화
   */

  // 구독 조회
  async getSubscriptionsByUserId(userId: number) {
    if (!userId) {
      throw new HttpException('userId는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    try {
      const subscriptions = await this.prismaService.subscription.findFirst({
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

  // 구독 생성
  async createSubscription(
    userId: number,
    planId: number,
    startDate: Date,
    isActive: boolean,
  ) {
    try {
      const endDate = new Date(startDate); // startDate를 복사하여 새로운 Date 객체 생성
      endDate.setMonth(startDate.getMonth() + 1); // endDate를 한 달 뒤로 설정

      const response = await this.prismaService.subscription.create({
        data: {
          userId,
          planId,
          startDate: startDate,
          endDate: endDate,
          isActive: isActive,
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

  // 구독 업데이트
  async updateSubscription(userId: number, planId: number) {
    try {
      const startDate = new Date();
      const subscription = await this.prismaService.subscription.findFirst({
        where: { userId },
      });

      if (!subscription) {
        throw new HttpException('Subscription not found', HttpStatus.NOT_FOUND);
      }

      const response = await this.prismaService.subscription.update({
        where: { id: subscription.id },
        data: { planId, startDate },
      });

      return response;
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw new HttpException(
        'Failed to update subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 결제내역 조회(userID) - 나의 모든 결제 내역 조회
  async getAllPaymentsByUserId(userId: number) {
    if (!userId) {
      throw new HttpException('userId는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    try {
      const payments = await this.prismaService.payment.findMany({
        where: { userId },
        include: {
          plan: true,
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

  // 결제내역 조회(paymentID) - 특정 결제 내역 조회
  async getPaymentById(paymentId: number) {
    if (!paymentId) {
      throw new HttpException('paymentId는 필수 입니다.', HttpStatus.NOT_FOUND);
    }

    try {
      const payment = await this.prismaService.payment.findUnique({
        where: { id: paymentId },
        include: {
          plan: true,
        },
      });
      return payment;
    } catch (error) {
      console.error('Error retrieving payment:', error);
      throw new HttpException(
        'Failed to retrieve payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 결제내역 생성
  async createPayment(
    userId: number,
    planId: number,
    amount: number,
    status: string,
    paymentKey: string,
    createdAt: Date,
  ) {
    try {
      const response = await this.prismaService.payment.create({
        data: {
          userId,
          planId,
          amount,
          status,
          paymentKey,
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

  // 환불내역 생성
  async cancelPayment(paymentId: number, cancelReason: string) {
    const idempotency = uuidv4(); // 멱등키

    const payment = await this.prismaService.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new HttpException(
        '결제 내역을 찾을 수 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (payment.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000 < Date.now()) {
      throw new HttpException(
        '결제 후 3일 이내에만 취소할 수 있습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const paymentKey = payment.paymentKey;

    if (!paymentKey) {
      throw new HttpException(
        '결제 키가 없습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      await axios.post(
        `${this.tossUrl}/${paymentKey}/cancel`,
        { cancelReason },
        {
          headers: {
            Authorization: `Basic ${btoa(`${this.secretKey}:`)}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `${idempotency}`,
          },
        },
      );

      // 결제 상태 업데이트
      await this.prismaService.payment.update({
        where: { id: paymentId },
        data: { status: 'CANCELLED' },
      });

      // 환불 기록 생성
      const refund = await this.prismaService.refund.create({
        data: {
          paymentId: paymentId,
          amount: payment.amount,
          status: 'REFUNDED',
          createdAt: new Date(),
        },
      });

      return {
        message: '환불 완료',
        refund,
      };
    } catch (error) {
      console.error('환불 요청 실패:', error);
      throw new HttpException(
        `${error.response.data.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 매일 자정 만료 구독 비활성화
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deactivateExpiredSubscriptions() {
    try {
      const currentDate = new Date();
      const subscriptions = await this.prismaService.subscription.findMany({
        where: {
          endDate: {
            lt: currentDate, // endDate가 현재 날짜보다 이전인 경우
          },
          isActive: true, // 현재 활성 상태인 구독만 대상으로 함
        },
      });

      subscriptions.forEach(async (subscription) => {
        await this.prismaService.subscription.update({
          where: { id: subscription.id },
          data: { isActive: false },
        });
      });

      console.log(`Deactivated ${subscriptions.length} expired subscriptions.`);
    } catch (error) {
      console.error('Failed to deactivate subscriptions:', error);
      throw new HttpException(
        'Failed to deactivate subscriptions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
