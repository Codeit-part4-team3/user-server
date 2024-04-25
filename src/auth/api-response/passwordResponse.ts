import { ApiResponse } from '@nestjs/swagger';

export const forgotConfirmNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '이메일을 입력해주세요' } },
      },
    },
  },
});

export const forgotNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '이메일을 입력해주세요' } },
      },
    },
  },
});

export const changePasswordNotData = ApiResponse({
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
