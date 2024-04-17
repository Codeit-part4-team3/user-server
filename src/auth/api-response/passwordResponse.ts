import { ApiResponse } from '@nestjs/swagger';

export const forgotConfirmNotData = ApiResponse({
  status: 400,
  description: 'badRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '이메일을 입력해주세요' } },
        example2: { value: { message: '새 비밀번호를 입력해주세요' } },
        example3: { value: { message: '코드를 입력해주세요' } },
      },
    },
  },
});

export const forgotNotData = ApiResponse({
  status: 400,
  description: 'badRequest',
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
  description: 'badRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: '헤더에 토큰이 없습니다.' } },
        example2: { value: { message: '비밀번호를 입력해주세요.' } },
        example3: { value: { message: '새 비밀번호를 입력해주세요.' } },
      },
    },
  },
});
