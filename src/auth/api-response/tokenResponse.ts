import { ApiResponse } from '@nestjs/swagger';
import { TOKEN_EXPIRED_OR_INVALID } from './../../constants/message';

export const failToken = ApiResponse({
  status: 400,
  description: 'BadRequest',
  schema: {
    type: 'object',
    properties: {
      message: { example: TOKEN_EXPIRED_OR_INVALID },
    },
  },
});

export const refreshTokenSuccess = ApiResponse({
  status: 200,
  description: 'Ok',
  schema: {
    type: 'object',
    properties: {
      accessToken: { example: 'string' },
    },
  },
});

export const unauthorized = ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    type: 'object',
    properties: {
      message: { example: 'Unauthorized' },
    },
  },
});
