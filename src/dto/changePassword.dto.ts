import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ description: '새 비밀번호', type: 'string' })
  @IsString({ message: '새로운 비밀번호는 필수 입니다.' })
  @Length(8, 20, { message: '비밀번호는 8자 이상 20자 이하이어야 합니다.' })
  newPassword: string;

  @ApiProperty({ description: '현재 비밀번호', type: 'string' })
  @IsString({ message: '현재 비밀번호는 필수입니다.' })
  @Length(8, 20, { message: '비밀번호는 8자 이상 20자 이하이어야 합니다.' })
  currentPassword: string;
}
