import { Test, TestingModule } from '@nestjs/testing';
import { TempOrdersController } from './tempOrders.controller';
import { TempOrdersService } from './tempOrders.service';
import { LoggerModule } from '../common/logger/logger.module';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AuthService } from '../auth/auth.service';

describe('TempOrdersController', () => {
  let controller: TempOrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [TempOrdersController],
      providers: [
        TempOrdersService,
        {
          provide: TempOrdersService,
          useValue: {
            createTempOrder: jest.fn().mockResolvedValue({
              id: '123',
              orderName: 'Test Order',
              totalAmount: 100,
            }),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest
              .fn()
              .mockResolvedValue({ userId: '123', username: 'testUser' }),
          },
        },
      ],
    }).compile();

    controller = module.get<TempOrdersController>(TempOrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
