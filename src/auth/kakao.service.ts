import { Injectable } from '@nestjs/common';

import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class KakaoService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async kakaoLogin(apikey: string, redirectUri: string, code: string) {
    const config = {
      grant_type: 'authorization_code',
      client_id: apikey,
      redirect_uri: redirectUri,
      code,
      client_secret: 'BDUcviEUJqk3KDFTxXyHvbGONfVChhn0',
    };

    const params = new URLSearchParams(config).toString();
    const tokenHeaders = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const tokenUrl = `https://kauth.kakao.com/oauth/token?${params}`; // 토큰얻어오기

    const resToken = await fetch(tokenUrl, {
      method: 'POST',
      headers: tokenHeaders,
    });
    const dataToken = await resToken.json(); //각종 토큰들 있음

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
    console.log(dataToken);

    // const userInfo = await this.authService;

    // return userInfo;
  }
}
