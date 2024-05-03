import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class InternalService {
  constructor(private readonly prismaService: PrismaService) {}

  async verifyEmail(email: string): Promise<string> {
    return `Email ${email} is verified`;
  }
}
