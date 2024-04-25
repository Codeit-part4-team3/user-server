import { ApiResponse } from '@nestjs/swagger';
import {
  EMAIL_VALID,
  PASSWORD_LENGTH,
  USER_CONFLICT,
} from '../../constants/message';

export const signupNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: EMAIL_VALID } },
        example2: {
          value: { message: PASSWORD_LENGTH },
        },
      },
    },
  },
});

export const signupConflictException = ApiResponse({
  status: 409,
  description: 'ConflictException',
  schema: {
    type: 'object',
    properties: {
      message: { example: USER_CONFLICT },
    },
  },
});
