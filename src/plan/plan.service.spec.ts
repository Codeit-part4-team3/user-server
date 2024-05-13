import { Test, TestingModule } from '@nestjs/testing';
import { PlanService } from './plan.service';
import { PrismaService } from '../prisma.service';
import { LoggerModule } from '../common/logger/logger.module';

describe('PlanService', () => {
  let service: PlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        PlanService,
        {
          provide: PrismaService,
          useValue: {
            plan: {
              findMany: jest
                .fn()
                .mockResolvedValue([{ id: 1, name: 'Basic', price: 10 }]),
              findUnique: jest
                .fn()
                .mockImplementation(({ where: { id } }) =>
                  id === 1
                    ? Promise.resolve({ id: 1, name: 'Basic', price: 10 })
                    : Promise.resolve(null),
                ),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PlanService>(PlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
