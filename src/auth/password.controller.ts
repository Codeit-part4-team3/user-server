import { Body, Controller, Request } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailDto } from './../dto/email.dto';
import { ForgotPasswordDto } from './../dto/forgotPassword.dto';
import { ChangePasswordDto } from './../dto/changePassword.dto';
import {
  ChangePasswordPut,
  ForgotConfirmPost,
  ForgotPost,
} from 'src/decorators/authDecorators';

@Controller('user/v1/')
export class PasswordController {
  constructor(private readonly authService: AuthService) {}

  // 비밀번호 잃어버렸을때 변경 코드요청
  @ApiTags('forgot')
  @ForgotPost('forgot')
  @ApiBody({
    type: EmailDto,
  })
  async forgotPassword(@Body() emailDto: EmailDto) {
    return this.authService.forgotPassword(emailDto);
  }

  // 비밀번호 리셋 및 새로운 비밀번호 생성
  @ApiTags('forgot')
  @ForgotConfirmPost('forgot/confirm')
  @ApiBody({
    type: ForgotPasswordDto,
  })
  async confirmPasswordReset(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.confirmPasswordReset(forgotPasswordDto);
  }

  // 비밀번호 변경
  @ApiTags('user')
  @ChangePasswordPut('user/password')
  @ApiBody({
    type: ChangePasswordDto,
  })
  async changePassword(
    @Request() request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const accessToken = request.headers['authorization']?.split(' ')[1];
    return await this.authService.changePassword(
      accessToken,
      changePasswordDto,
    );
  }
}
