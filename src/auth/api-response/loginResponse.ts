import { ApiResponse } from '@nestjs/swagger';
import { EMAIL_FORBIDDEN, LOGIN_BAD_REQUEST } from '../../constants/message';

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
          state: {
            properties: {
              id: { example: 1 },
              name: { example: '온라인' },
              userId: { example: 2 },
            },
          },
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
      message: { example: LOGIN_BAD_REQUEST },
    },
  },
});

export const loginForbidden = ApiResponse({
  status: 403,
  description: 'Forbidden',
  schema: {
    type: 'object',
    properties: {
      message: { example: EMAIL_FORBIDDEN },
    },
  },
});
