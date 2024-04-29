import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignupDto } from '../dto/signup.dto';
import { ConfirmSignupDto } from './../dto/confirmSignup.dto';
import { LoginDto } from './../dto/login.dto';
import { EmailDto } from './../dto/email.dto';
import {
  AccessTokenGet,
  LoginPost,
  SignUpConfirmPost,
  SignUpPost,
  SignUpResentCodePost,
} from '../decorators/authDecorators';

@ApiTags('auth')
@Controller('/user/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //회원가입
  @SignUpPost('signup')
  @ApiBody({ type: SignupDto })
  async signUp(@Body() signupDto: SignupDto) {
    await this.authService.signUp(signupDto);
  }

  // 이메일 인증
  @SignUpConfirmPost('signup/confirm')
  @ApiBody({ type: ConfirmSignupDto })
  async confirmSignup(@Body() confirmSignupDto: ConfirmSignupDto) {
    await this.authService.confirmSignUp(confirmSignupDto);
  }

  // 인증번호 다시보내기
  @SignUpResentCodePost('signup/resend')
  @ApiBody({ type: EmailDto })
  async resendConfirmationCode(@Body() emailDto: EmailDto) {
    await this.authService.resendConfirmationCode(emailDto);
  }

  //로그인
  @LoginPost('login')
  @ApiBody({ type: LoginDto })
  async Login(@Body() loginDto: LoginDto) {
    return await this.authService.Login(loginDto);
  }

  //토큰 갱신
  @AccessTokenGet('token')
  async getToken(@Request() request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new HttpException('토큰이 없습니다.', HttpStatus.NOT_FOUND);
    }

    return await this.authService.getToken(token);
  }
}
