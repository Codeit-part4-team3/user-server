import { Controller, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import {
  GoogleLoginGet,
  GoogleSignupGet,
} from '../decorators/oauthDecoreators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('oauth')
@Controller('/user/v1/auth/')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @GoogleSignupGet('google/signup')
  async getKakaoSignUp(@Query('code') code: string) {
    return await this.googleService.googleSignUp(code);
  }

  @GoogleLoginGet('google/login')
  async getKakaoLogin(@Query('code') code: string) {
    return await this.googleService.googleLogin(code);
  }
}
