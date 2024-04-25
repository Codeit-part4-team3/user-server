import { Get, HttpCode, Put, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

const MyInfo = ApiResponse({
  status: 200,
  description: 'OK',
  schema: {
    type: 'object',
    properties: {
      userInfo: {
        properties: {
          id: { example: 2 },
          email: { example: 'test@test.com' },
          nickName: { example: 'string' },
          state: {
            properties: {
              id: { example: 1 },
              name: { example: '온라인' },
              userId: { example: 2 },
            },
          },
        },
      },
    },
  },
});

export const MyState = ApiResponse({
  status: 200,
  description: 'OK',
  schema: {
    type: 'object',
    properties: {
      state: {
        properties: {
          id: { example: 1 },
          name: { example: '온라인' },
          userId: { example: 2 },
        },
      },
    },
  },
});

export function MyInfoGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(200),
    ApiOperation({
      summary: '내 정보 조회',
    }),
    MyInfo,
  );
}

export function MyStateGet(path: string) {
  return applyDecorators(
    Get(path),
    HttpCode(200),
    ApiOperation({
      summary: '내 상태 조회',
    }),
    MyState,
  );
}

export function MyStatePut(path: string) {
  return applyDecorators(
    Put(path),
    HttpCode(200),
    ApiOperation({
      summary: '내 상태 수정',
    }),
    MyState,
  );
}
