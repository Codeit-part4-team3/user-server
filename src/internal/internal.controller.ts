import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { InternalService } from './internal.service';
import { VerifyEmailDto } from 'src/dto/internal.dto';

@Controller('internal/v1')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post('verifyEmail')
  @HttpCode(200)
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<string> {
    return this.internalService.verifyEmail(verifyEmailDto.email);
  }
}
