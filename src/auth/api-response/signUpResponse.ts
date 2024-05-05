import { ApiResponse } from '@nestjs/swagger';
import {
  EMAIL_INVALID,
  PASSWORD_LENGTH_REQUIREMENT,
  USER_ALREADY_EXISTS,
} from '../../constants/message';

export const signupNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  content: {
    'application/json': {
      examples: {
        example1: { value: { message: EMAIL_INVALID } },
        example2: {
          value: { message: PASSWORD_LENGTH_REQUIREMENT },
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
      message: { example: USER_ALREADY_EXISTS },
    },
  },
});
