import { Test, TestingModule } from '@nestjs/testing';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { LoggerModule } from '../common/logger/logger.module';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { AuthService } from '../auth/auth.service';

describe('PlanController', () => {
  let controller: PlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [PlanController],
      providers: [
        {
          provide: PlanService,
          useValue: {
            getAllPlans: jest
              .fn()
              .mockResolvedValue([{ id: 1, name: 'Basic', price: 10 }]),
            getPlanByPlanId: jest.fn().mockImplementation((id) =>
              Promise.resolve({
                id,
                name: 'Advanced',
                price: 20,
              }),
            ),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PlanController>(PlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
