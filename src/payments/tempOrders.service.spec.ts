import { Test, TestingModule } from '@nestjs/testing';
import { TempOrdersService } from './tempOrders.service';
import { PrismaService } from '../prisma.service';

describe('TempOrdersService', () => {
  let service: TempOrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TempOrdersService,
        {
          provide: PrismaService,
          useValue: {
            tempOrder: {
              create: jest
                .fn()
                .mockImplementation(({ data }) =>
                  Promise.resolve({ tempOrderId: data.tempOrderId, ...data }),
                ),
              findUnique: jest.fn().mockImplementation(({ where }) =>
                where.tempOrderId === 'validId'
                  ? Promise.resolve({
                      tempOrderId: 'validId',
                      orderName: 'Test Order',
                      totalAmount: 100,
                    })
                  : Promise.resolve(null),
              ),
              delete: jest
                .fn()
                .mockImplementation(({ where }) =>
                  where.tempOrderId === 'validId'
                    ? Promise.resolve({ tempOrderId: 'validId' })
                    : Promise.reject(new Error('Order not found')),
                ),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TempOrdersService>(TempOrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
