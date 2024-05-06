import { ApiResponse } from '@nestjs/swagger';
import { TOKEN_MISSING } from './../../constants/message';

export const getUserTokenNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: TOKEN_MISSING } },
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
