import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfirmPaymentDto } from 'src/dto/confirmPayment.dto';
import { v4 as uuidv4 } from 'uuid';
import { TempOrdersService } from './tempOrders.service';
import { CardIssuerCode, CardIssuerName } from './config/payment.config';

@Injectable()
export class PaymentsService {
  private readonly tossUrl = 'https://api.tosspayments.com/v1/payments/confirm';
  private readonly secretKey = process.env.TOSS_SECRET_KEY;

  constructor(private readonly tempOrdersService: TempOrdersService) {}

  public async confirmPayment(confirmPaymentDto: ConfirmPaymentDto) {
    const idempotency = uuidv4(); // 멱등키 생성
    const { orderId, amount, paymentKey } = confirmPaymentDto;

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

      let paymentMethod: string = '알 수 없음';

      if (method === '카드') {
        // 발급사 코드에 따른 발급사명 리턴
        const issuerCode: CardIssuerCode = response.data.card.issuerCode;
        paymentMethod = CardIssuerName[issuerCode];
      }

      if (method === '간편결제') {
        paymentMethod = response.data.easyPay.provider;
      }

      if (method === '휴대폰') {
        paymentMethod = response.data.method;
      }

      return {
        title: '결제 성공',
        paymentMethod,
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
}
