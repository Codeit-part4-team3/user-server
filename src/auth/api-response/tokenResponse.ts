import { ApiResponse } from '@nestjs/swagger';
import { FAIL_TOKEN } from './../../constants/message';

export const failToken = ApiResponse({
  status: 400,
  description: 'BadRequest',
  schema: {
    type: 'object',
    properties: {
      message: { example: FAIL_TOKEN },
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
