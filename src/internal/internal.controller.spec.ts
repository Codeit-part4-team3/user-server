import { Test, TestingModule } from '@nestjs/testing';
import { InternalController } from './internal.controller';
import { InternalService } from './internal.service';
import { PrismaService } from '../prisma.service';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

describe('InternalController', () => {
  let controller: InternalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalController],
      providers: [InternalService, PrismaService],
      imports: [
        WinstonModule.forRoot({
          transports: [new winston.transports.Console()],
        }),
      ],
    }).compile();

    controller = module.get<InternalController>(InternalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
