import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { TempOrdersService } from './tempOrders.service';
import { TempOrdersController } from './tempOrders.controller';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';

@Module({
  controllers: [TempOrdersController, PaymentsController],
  providers: [
    PrismaService,
    TempOrdersService,
    AuthService,
    UserService,
    PaymentsService,
  ],
})
export class PaymentsModule {}
