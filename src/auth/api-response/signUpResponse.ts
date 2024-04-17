import { ApiResponse } from '@nestjs/swagger';

export const signupNotData = ApiResponse({
  status: 400,
  description: 'badRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '이메일을 입력해주세요.' } },
        example2: { value: { message: '닉네임을 입력해주세요.' } },
        example3: { value: { message: '비밀번호를 입력해주세요.' } },
      },
    },
  },
});

export const signupSuccessData = ApiResponse({
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
