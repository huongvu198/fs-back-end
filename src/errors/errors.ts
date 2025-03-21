import { HttpStatus } from '@nestjs/common';

import { ErrorCode, ErrorType } from './errors.interface';

const BASE_ERROR_CODE = '10';
const GENERAL_GROUP_ERROR_CODE = '00';
const THIRD_PARTY_GROUP_ERROR_CODE = '01';

const getErrorCode = (code: ErrorCode, group = GENERAL_GROUP_ERROR_CODE) =>
  `${BASE_ERROR_CODE}${group}${code}`;

export const Errors: Record<string, ErrorType> = {
  INTERNAL_SERVER_ERROR: {
    errorCode: getErrorCode(ErrorCode.INTERNAL_SERVER_ERROR),
    message: 'Internal server error.',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  UNKNOWN_ERROR: {
    errorCode: getErrorCode(ErrorCode.UNKNOWN_ERROR),
    message: 'An unknown error occurred.',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  INVALID_FORMAT_PHONE_NUMBER: {
    errorCode: getErrorCode(ErrorCode.INVALID_FORMAT_PHONE_NUMBER),
    message: 'Phone number invalid format.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  ROLE_NOT_FOUND: {
    errorCode: getErrorCode(ErrorCode.INVALID_FORMAT_PHONE_NUMBER),
    message: 'Role not found.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    errorCode: getErrorCode(ErrorCode.USER_NOT_FOUND),
    message: 'User not found.',
    statusCode: HttpStatus.NOT_FOUND,
  },
  EMAIL_ALREADY_EXISTS: {
    errorCode: getErrorCode(ErrorCode.EMAIL_ALREADY_EXISTS),
    message: 'Email already exists.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  DEFAULT_ADDRESS: {
    errorCode: getErrorCode(ErrorCode.DEFAULT_ADDRESS),
    message: 'Cannot delete the default address.',
    statusCode: HttpStatus.BAD_REQUEST,
  },
  CREATE_CUSTOMER_FAILED: {
    errorCode: getErrorCode(ErrorCode.CREATE_CUSTOMER_FAILED),
    message: 'Create account failed. Please try again',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
