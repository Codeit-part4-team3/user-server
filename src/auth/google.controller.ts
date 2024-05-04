import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('/user/v1/auth/')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @HttpCode(201)
  @Get('google/signup')
  async getKakaoSignUp(@Query('code') code: string) {
    await this.googleService.googleSignUp(code);
  }

  @HttpCode(200)
  @Get('google/login')
  async getKakaoLogin(@Query('code') code: string) {
    return await this.googleService.googleLogin(code);
  }
}
