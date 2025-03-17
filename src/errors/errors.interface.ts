import { HttpStatus } from '@nestjs/common';

export type ErrorType = {
  message: string;
  statusCode: HttpStatus;
  errorCode: string;
};

export interface IGeneralErrorShape {
  name?: string;
  message?: string;
  errorCode?: string;
  description?: string;
  statusCode?: HttpStatus;
  customData?: unknown;
  stackTrace?: string;
  logData?: unknown;
  errors?: unknown;
}

export enum ErrorCode {
  // General errors
  UNKNOWN_ERROR = '000',
  BAD_REQUEST = '400',
  UNAUTHORIZED = '401',
  FORBIDDEN = '403',
  NOT_FOUND = '404',
  TOO_MANY_REQUESTS = '429',
  INTERNAL_SERVER_ERROR = '500',
  SERVICE_UNAVAILABLE = '503',

  // Authentication & authorization errors
  JWT_INVALID = '001',
  JWT_EXPIRED = '002',

  /** Specific errors */

  INVALID_FORMAT_PHONE_NUMBER = '003',
  ROLE_NOT_FOUND = '004',
  EMAIL_ALREADY_EXISTS = '005',
  USER_NOT_FOUND = '006',
  DEFAULT_ADDRESS = '007',
}
