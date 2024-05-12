import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AmountDto } from 'src/dto/amount.dto';

@Injectable()
export class EventService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  // 누적 금액 생성
  async createEventAmount(amountDto: AmountDto) {
    const existing = await this.getEventAmount();

    if (existing !== null) {
      this.logger.error('이미 누적 금액이 존재합니다.');
      throw new HttpException(
        '이미 누적 금액이 존재합니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const eventAmount = await this.prismaService.eventAmount.create({
        data: {
          id: 1,
          amount: amountDto.amount,
        },
      });
      this.logger.info('누적 금액 테이블 생성 완료', eventAmount);
      return eventAmount;
    } catch (error) {
      this.logger.error('누적 금액 테이블 생성 실패:', error);
      throw new HttpException(
        'Event Amount Table creation failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 누적 금액 업데이트
  async updateEventAmount(amount: number) {
    const existing = await this.getEventAmount();

    if (!existing) {
      throw new HttpException(
        '누적 금액이 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const eventAmount = await this.prismaService.eventAmount.update({
        where: {
          id: existing.id,
        },
        data: {
          amount: existing.amount + amount,
        },
      });

      this.logger.info('누적 금액 업데이트 완료');
      return eventAmount;
    } catch (error) {
      this.logger.error('누적 금액 업데이트 실패:', error);
      throw new HttpException(
        'Failed to update Accumulated Amount',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 누적 금액 조회
  async getEventAmount() {
    try {
      const eventAmount = await this.prismaService.eventAmount.findUnique({
        where: {
          id: 1,
        },
      });
      this.logger.info('누적 금액 조회 완료');
      return eventAmount;
    } catch (error) {
      this.logger.error('누적 금액 조회 실패:', error);
      throw new HttpException(
        'Failed to retrieve subscriptions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 누적 금액 삭제
  async deleteEventAmount() {
    try {
      const eventAmount = await this.prismaService.eventAmount.delete({
        where: {
          id: 1,
        },
      });
      this.logger.info('누적 금액 삭제 완료');
      return eventAmount;
    } catch (error) {
      this.logger.error('누적 금액 삭제 실패:', error);
      throw new HttpException(
        'Failed to delete accumulated amount',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
