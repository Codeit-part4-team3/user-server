import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityServiceProvider;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityServiceProvider({
      region: 'ap-northeast-2',
    });

    this.clientId = this.configService.get<string>('CLIENT_ID');
  }

  async signUp(email: string, password: string) {
    const params = {
      ClientId: this.clientId,
      Username: email,
      Password: password,
    };

    return await this.cognitoClient.signUp(params).promise();
  }

  async confirmSignUp(email: string, code: string) {
    const params = {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    };

    return await this.cognitoClient.confirmSignUp(params).promise();
  }

  async Login(email: string, password: string) {
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    return await this.cognitoClient.initiateAuth(params).promise();
  }

  async getUserInfo(accessToken: string) {
    return await this.cognitoClient
      .getUser({ AccessToken: accessToken })
      .promise();
  }

  async changePassword(
    accessToken: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const params = {
      AccessToken: accessToken, // 현재 사용자의 액세스 토큰을 입력하세요
      PreviousPassword: currentPassword, // 현재 비밀번호 입력
      ProposedPassword: newPassword, // 새로운 비밀번호 입력
    };

    return await this.cognitoClient.changePassword(params).promise();
  }
  async getToken(refreshToken: string) {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    return this.cognitoClient.initiateAuth(params).promise();
  }
  async forgotPassword(email: string) {
    const params = {
      ClientId: this.clientId,
      Username: email,
    };

    return await this.cognitoClient.forgotPassword(params).promise();
  }
  async confirmPasswordReset(email: string, newPassword: string, code: string) {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Password: newPassword,
      Username: email,
    };

    return await this.cognitoClient.confirmForgotPassword(params).promise();
  }
  async resendConfirmationCode(email: string) {
    const params = {
      ClientId: this.clientId,
      Username: email,
    };

    return await this.cognitoClient.resendConfirmationCode(params).promise();
  }
}
