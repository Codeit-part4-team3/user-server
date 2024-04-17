import { ApiProperty } from '@nestjs/swagger';

export class SignUpSchema {
  @ApiProperty({ description: '이메일', type: 'string' })
  email: string;

  @ApiProperty({ description: '비밀번호', type: 'string' })
  password: string;

  @ApiProperty({ description: '닉네임', type: 'string' })
  nickname: string;
}
