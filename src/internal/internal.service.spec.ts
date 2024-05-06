import { Test, TestingModule } from '@nestjs/testing';
import { InternalService } from './internal.service';
import { PrismaService } from '../prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

describe('InternalService', () => {
  let service: InternalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternalService, PrismaService],
      imports: [
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    service = module.get<InternalService>(InternalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
