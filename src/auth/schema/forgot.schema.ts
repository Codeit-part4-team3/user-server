import { ApiProperty } from '@nestjs/swagger';

export class ForgotSchema {
  @ApiProperty({ description: '이메일', example: 'test@codeit.com' })
  email: string;
}
