import { ApiProperty } from '@nestjs/swagger';

export class ForgotConfirmSchema {
  @ApiProperty({ description: '이메일', type: 'string' })
  email: string;

  @ApiProperty({ description: '비밀번호', type: 'string' })
  newPassword: string;

  @ApiProperty({ description: '받은 코드', type: 'string' })
  code: string;
}
