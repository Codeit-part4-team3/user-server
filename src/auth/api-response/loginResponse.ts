import { ApiResponse } from '@nestjs/swagger';
import {
  VERIFY_EMAIL_REQUEST,
  LOGIN_CREDENTIALS_INCORRECT,
  USER_NOT_REGISTERED,
} from '../../constants/message';

export const loginOk = ApiResponse({
  status: 200,
  description: 'OK',
  schema: {
    type: 'object',
    properties: {
      userInfo: {
        properties: {
          id: { example: 2 },
          email: { example: 'test@test.com' },
          nickName: { example: 'string' },
          state: { example: 'string' },
        },
      },
      token: {
        properties: {
          accessToke: { example: 'string' },
          refreshToken: { example: 'string' },
        },
      },
    },
  },
});

export const loginBadRequest = ApiResponse({
  status: 400,
  description: 'BadRequest',
  schema: {
    type: 'object',
    properties: {
      message: { example: LOGIN_CREDENTIALS_INCORRECT },
    },
  },
});

export const loginForbidden = ApiResponse({
  status: 403,
  description: 'Forbidden',
  schema: {
    type: 'object',
    properties: {
      message: { example: VERIFY_EMAIL_REQUEST },
    },
  },
});

export const LoginNotData = ApiResponse({
  status: 404,
  description: 'NotFound',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: USER_NOT_REGISTERED } },
      },
    },
  },
});
