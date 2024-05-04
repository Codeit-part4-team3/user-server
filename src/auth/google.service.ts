import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';
import { generatePassword } from '../util/generatePassword';

@Injectable()
export class GoogleService {
  private readonly googleClientSecret: string;
  private readonly redirectLoginUri: string;
  private readonly redirectSignupUri: string;
  private readonly googleClientId: string;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.googleClientSecret = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    );

    this.redirectLoginUri =
      this.configService.get<string>('REDIRECT_LOGIN_URI');

    this.redirectSignupUri = this.configService.get<string>(
      'REDIRECT_SIGNUP_URI',
    );

    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
  }

  async googleSign(code: string, redirectUri: string) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: this.googleClientId,
        client_secret: this.googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    const accessToken = data['access_token'];

    if (accessToken) {
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      );

      const userInfo = await userInfoResponse.json();

      return { email: userInfo.email, nickname: userInfo.name };
    }
  }

  // 구글 로그인
  async googleLogin(code: string) {
    const googleInfo = await this.googleSign(code, this.redirectLoginUri);
    const user = await this.userService.getUserByEmail(googleInfo.email);

    return await this.authService.Login({
      email: user.email,
      password: user.password,
    });
  }

  // 구글 회원가입
  async googleSignUp(code: string) {
    const googleInfo = await this.googleSign(code, this.redirectSignupUri);
    const newPassword = generatePassword(10);

    try {
      return await this.authService.signUp({
        email: googleInfo.email,
        password: newPassword,
        nickname: googleInfo.nickname,
      });
    } catch (e) {
      throw new HttpException('이미 가입된 회원입니다.' + e, 409);
    }
  }
}
