import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserInfoDto {
  @ApiProperty({ description: '닉네임', type: 'string' })
  @IsString()
  nickname?: string;
}
