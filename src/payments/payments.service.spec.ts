import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { TempOrdersService } from './tempOrders.service';
import { PrismaService } from '../prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: TempOrdersService,
          useValue: {
            getTempOrdersData: jest.fn().mockResolvedValue({
              tempOrderId: 'orderId123',
              totalAmount: 1000,
            }),
            deleteTempOrder: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            payment: {
              create: jest.fn().mockResolvedValue({ id: 'payment123' }),
              findUnique: jest.fn().mockResolvedValue({
                orderId: 'orderId123',
                paymentKey: 'key123',
                amount: 1000,
              }),
              update: jest.fn().mockResolvedValue({ status: 'REFUNDED' }),
            },
            subscription: {
              findFirst: jest.fn().mockResolvedValue({ id: 'sub123' }),
              create: jest.fn().mockResolvedValue({ id: 'sub123' }),
              update: jest.fn().mockResolvedValue({ isActive: false }),
            },
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
          },
        },
        ConfigService,
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
