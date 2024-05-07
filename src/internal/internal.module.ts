import { Module } from '@nestjs/common';
import { InternalService } from './internal.service';
import { InternalController } from './internal.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [InternalService, PrismaService],
  controllers: [InternalController],
})
export class InternalModule {}
