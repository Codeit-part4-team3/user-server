import { ApiResponse } from '@nestjs/swagger';

export const getUserTokenNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '헤더에 토큰이 없습니다.' } },
      },
    },
  },
});

export const getUserTokenData = ApiResponse({
  status: 201,
  description: 'Created',
  schema: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      email: { type: 'string' },
      nickname: { type: 'string' },
      state: { type: 'string' },
    },
  },
});
