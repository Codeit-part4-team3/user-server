import { ApiResponse } from '@nestjs/swagger';

export const signupNotData = ApiResponse({
  status: 400,
  description: 'badRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '유효하지 않은 이메일 주소입니다.' } },
        example2: {
          value: { message: '비밀번호는 8자 이상 20자 이하이어야 합니다.' },
        },
      },
    },
  },
});

export const signupSuccessData = ApiResponse({
  status: 201,
  description: 'success',
});
