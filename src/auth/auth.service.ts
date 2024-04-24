import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { UserService } from '../user/user.service';
import { SignupDto } from './../dto/signup.dto';
import { ConfirmSignupDto } from './../dto/confirmSignup.dto';
import { LoginDto } from './../dto/login.dto';
import { EmailDto } from './../dto/email.dto';
import { ForgotPasswordDto } from './../dto/forgotPassword.dto';
import { ChangePasswordDto } from './../dto/changePassword.dto';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityServiceProvider;
  private readonly clientId: string;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.cognitoClient = new CognitoIdentityServiceProvider({
      region: 'ap-northeast-2',
    });

    this.clientId = this.configService.get<string>('CLIENT_ID');
  }

  // 토큰으로 로그인
  async tokenLogin(accessToken: string) {
    return await this.cognitoClient
      .getUser({ AccessToken: accessToken })
      .promise();
  }

  // 토큰으로 유저 정보 불러오기
  async tokenGetUser(token: string) {
    try {
      const email = (await this.tokenLogin(token)).UserAttributes.find(
        (it) => it.Name === 'email',
      ).Value;

      return this.userService.getUserByEmail(email);
    } catch (_) {
      throw new HttpException(
        '만료된 토큰이거나 잘못된 토큰입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // 회원가입
  async signUp(signupDto: SignupDto) {
    const { email, password } = signupDto;
    const params = {
      ClientId: this.clientId,
      Username: email,
      Password: password,
    };

    try {
      return await this.cognitoClient.signUp(params).promise();

      return await this.userService.createUser(signupDto);
    } catch (e) {
      throw new HttpException('회원가입에 실패했습니다.', HttpStatus.CONFLICT);
    }
  }

  // 이메일 인증
  async confirmSignUp(confirmSignupDto: ConfirmSignupDto) {
    const { email, code } = confirmSignupDto;
    const params = {
      ClientId: this.clientId,
      Username: email,
      ConfirmationCode: code,
    };
    try {
      const res = await this.cognitoClient.confirmSignUp(params).promise();
      return res;
    } catch (e) {
      throw new HttpException(
        '코드가 만료되었거나 일치하지 않습니다!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 로그인
  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    try {
      const res = await this.cognitoClient.initiateAuth(params).promise();
      const userInfo = await this.userService.getUserByEmail(email);
      const AuthenticationResult = res.AuthenticationResult;

      return {
        userInfo,
        token: {
          accessToken: AuthenticationResult.AccessToken,
          refreshToken: AuthenticationResult.RefreshToken,
        },
      };
    } catch (e) {
      if (e.code === 'UserNotConfirmedException') {
        throw new HttpException('이메일을 인증하세요!', HttpStatus.CONFLICT);
      }

      throw new HttpException(
        '아이디 혹은 비밀번호가 틀렸습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 비밀번호 변경
  async changePassword(
    accessToken: string,
    changePasswordDto: ChangePasswordDto,
  ) {
    const { currentPassword, newPassword } = changePasswordDto;
    const params = {
      AccessToken: accessToken, // 현재 사용자의 액세스 토큰을 입력하세요
      PreviousPassword: currentPassword, // 현재 비밀번호 입력
      ProposedPassword: newPassword, // 새로운 비밀번호 입력
    };

    try {
      const res = await this.cognitoClient.changePassword(params).promise();
      return res;
    } catch (e) {
      throw new HttpException(
        '토큰 또는 비밀번호가 유효하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getToken(refreshToken: string) {
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    try {
      const res = await this.cognitoClient.initiateAuth(params).promise();

      return { accessToken: res.AuthenticationResult.AccessToken };
    } catch (e) {
      throw new HttpException(
        '토큰이 유효하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async forgotPassword(emailDto: EmailDto) {
    const { email } = emailDto;
    const params = {
      ClientId: this.clientId,
      Username: email,
    };

    try {
      const res = await this.cognitoClient.forgotPassword(params).promise();
      return res;
    } catch (e) {
      throw new HttpException(
        'Forgot password initiation failed.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async confirmPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const { email, code, newPassword } = forgotPasswordDto;

    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Password: newPassword,
      Username: email,
    };

    try {
      const res = await this.cognitoClient
        .confirmForgotPassword(params)
        .promise();
      return res;
    } catch (e) {
      throw new HttpException(
        'Password reset confirmation failed.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resendConfirmationCode(emailDto: EmailDto) {
    const { email } = emailDto;
    const params = {
      ClientId: this.clientId,
      Username: email,
    };

    try {
      const res = await this.cognitoClient
        .resendConfirmationCode(params)
        .promise();
      return res;
    } catch (e) {
      throw new HttpException(
        'Failed to resend confirmation code.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
