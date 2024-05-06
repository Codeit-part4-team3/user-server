import { ApiResponse } from '@nestjs/swagger';
import { FAIL_CODE_EXPIRED_OR_INVALID } from './../../constants/message';

export const signupConfirmNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  schema: {
    type: 'object',
    properties: {
      message: { example: FAIL_CODE_EXPIRED_OR_INVALID },
    },
  },
});
