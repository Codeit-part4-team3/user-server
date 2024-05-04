import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InternalService {
  constructor(private readonly prismaService: PrismaService) {}

  async verifyEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }
}
