import { ApiResponse } from '@nestjs/swagger';
import { FAIL_CODE } from './../../constants/message';

export const signupConfirmNotData = ApiResponse({
  status: 400,
  description: 'BadRequest',
  schema: {
    type: 'object',
    properties: {
      message: { example: FAIL_CODE },
    },
  },
});
