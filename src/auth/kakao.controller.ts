import { Body, Controller, Get, Query } from '@nestjs/common';
import { KakaoService } from './kakao.service';

@Controller('api/user/v1/auth')
export class KakaoController {
  constructor(private readonly kakaoService: KakaoService) {}

  @Get('kakao')
  async getKakaoInfo(@Query('code') code: string) {
    const apikey = '39b8385b093fea7bc538c1ce8697dffe';
    const redirectUri = 'http://localhost:5173/oauth';
    return await this.kakaoService.kakaoLogin(apikey, redirectUri, code);
  }
}
