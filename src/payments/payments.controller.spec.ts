import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { LoggerModule } from '../common/logger/logger.module';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AuthService } from '../auth/auth.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            confirmPayment: jest.fn().mockResolvedValue({ success: true }),
            getSubscriptionsByUserId: jest.fn().mockResolvedValue([]),
            updateSubscription: jest.fn().mockResolvedValue({ updated: true }),
            getAllPaymentsByUserId: jest.fn().mockResolvedValue([]),
            getPaymentByOrderId: jest.fn().mockResolvedValue({}),
            cancelPayment: jest.fn().mockResolvedValue({ canceled: true }),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
        {
          provide: AuthService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
