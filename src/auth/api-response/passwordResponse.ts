import { ApiResponse } from '@nestjs/swagger';
import { EMAIL_REQUIRED } from '../../constants/message';

export const forgotConfirmNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: EMAIL_REQUIRED } },
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
        example1: { value: { message: EMAIL_REQUIRED } },
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
