export enum EApiTags {
  HEALTH_CHECK = 'health_check',
  AUTH = 'auth',
  USER = 'users',
  CUSTOMER = 'customers',
  WEBHOOK = 'webhooks',
  PRODUCT = 'products',
}

export enum EApiCmsTags {
  PRODUCT = 'products-cms',
  MASTER_DATA = 'master-data-cms',
}

export enum ERole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export enum AuthProvidersEnum {
  EMAIL = 'EMAIL',
  AUTH0 = 'AUTH0',
}

export enum VerifyCodeEnum {
  RESEND_CODE = 'RESEND_CODE',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
}

export enum MasterDataEnum {
  MASTER = 'MASTER',
}
