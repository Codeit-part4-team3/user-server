import { ApiResponse } from '@nestjs/swagger';

// 수정중...
export const signupConfirmNotData = ApiResponse({
  status: 400,
  description: 'badRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '이메일을 입력해주세요.' } },
        example2: { value: { message: '코드를 입력해주세요.' } },
      },
    },
  },
});

export const signupConfirmSuccessData = ApiResponse({
  status: 201,
  description: 'success',
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
