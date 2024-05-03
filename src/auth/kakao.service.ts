import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoService {
  private readonly kakaoClientId: string;
  private readonly redirectLoginUri: string;
  private readonly redirectSignupUri: string;
  private readonly kakaoClientSecret: string;
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    this.kakaoClientId = this.configService.get<string>('KAKAO_CLIENT_ID');
    this.redirectLoginUri =
      this.configService.get<string>('REDIRECT_LOGIN_URI');
    this.redirectSignupUri = this.configService.get<string>(
      'REDIRECT_SIGNUP_URI',
    );
    this.kakaoClientSecret = this.configService.get<string>(
      'KAKAO_CLIENT_SECRET',
    );
  }

  async kakaoSign(code: string, redirectUri: string) {
    // 설정
    const config = {
      grant_type: 'authorization_code',
      client_id: this.kakaoClientId,
      redirect_uri: redirectUri,
      code,
      client_secret: this.kakaoClientSecret,
    };

    const params = new URLSearchParams(config).toString();
    const tokenHeaders = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const tokenUrl = `https://kauth.kakao.com/oauth/token?${params}`;

    // 토큰 가져오기
    const resToken = await fetch(tokenUrl, {
      method: 'POST',
      headers: tokenHeaders,
    });
    const dataToken = await resToken.json(); //각종 토큰들 있음

    // 카카오 access token으로 카카오 정보 가져오기
    const accessToken = dataToken['access_token'];
    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const info = await userInfoResponse.json(); // 카카오톡 정보들 가져옴(이메일, 닉네임)
    const kakaoInfo = info['kakao_account'];
    const res = {
      email: kakaoInfo['email'],
      nickname: kakaoInfo['profile']['nickname'],
    };

    return res;
  }

  // 카카오로 로그인
  async kakaoLogin(code: string) {
    const kakaoInfo = await this.kakaoSign(code, this.redirectLoginUri);
    const user = await this.userService.getUserByEmail(kakaoInfo.email);

    if (!user) {
      throw new HttpException('가입 되지 않은 회원입니다.', 404);
    }

    return await this.authService.Login({
      email: user.email,
      password: user.password,
    });
  }

  // 카카오로 회원가입
  async kakaoSignUp(code: string) {
    const kakaoInfo = await this.kakaoSign(code, this.redirectSignupUri);

    try {
      return await this.authService.signUp({
        email: kakaoInfo.email,
        password: kakaoInfo.email,
        nickname: kakaoInfo.nickname,
      });
    } catch (e) {
      throw new HttpException('이미 가입된 회원입니다.' + e, 409);
    }
  }
}
