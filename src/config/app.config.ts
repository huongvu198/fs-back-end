import * as dotenv from 'dotenv';

dotenv.config();

const { env } = process;

export const config = {
  nodeEnv: env.NODE_ENV,
  jwt: {
    expiresIn: env.JWT_EXPIRES_IN ?? '1d',
    forgotExpiresIn: env.JWT_FORGOT_EXPIRES_IN ?? '1d',
    forgotSecret: env.JWT_FORGOT_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN ?? '1d',
    refreshSecret: env.JWT_REFRESH_SECRET,
    secret: env.JWT_SECRET,
  },
  redis: {
    host: env.REDIS_HOST ?? '127.0.0.1',
    max: env.REDIS_MAX_ITEM ?? 10000,
    port: env.REDIS_PORT ?? 6379,
    ttl: env.REDIS_TTL ?? '86400',
  },
  server: {
    host: env.SERVER_HOST,
    hostname: env.SERVER_HOST_NAME,
    port: env.SERVER_PORT,
    schema: env.SERVER_SCHEMA,
    swaggerBasicAuthUsername: env.SERVER_SWAGGER_BASIC_AUTH_USERNAME,
    swaggerBasicAuthPass: env.SERVER_SWAGGER_BASIC_AUTH_PASS,
    swaggerSchema: env.SERVER_SWAGGER_SCHEMA,
  },
  service: {
    apiVersion: env.SERVICE_API_VERSION,
    appVersion: env.SERVICE_APP_VERSION,
    baseUrl: env.SERVICE_BASE_URL,
    description: env.SERVICE_DESCRIPTION,
    docsBaseUrl: env.SERVICE_DOCS_BASE_URL,
    name: env.SERVICE_NAME,
  },
  mongoUri: env.MONGO_DB_URI,
  root: {
    email: env.ROOT_USER_EMAIL ?? 'vuthihuong@gmail.com',
    password: env.ROOT_USER_PASSWORD ?? 'vuthihuong',
    phoneNumber: env.ROOT_USER_PHONENUMBER ?? '082726123',
  },
  mail: {
    admin: env.MAIL_ADMIN,
    defaultEmail: env.MAIL_DEFAULT_EMAIL,
    defaultName: env.MAIL_DEFAULT_NAME,
    host: env.MAIL_HOST,
    ignoreTLS: env.MAIL_IGNORE_TLS,
    password: env.MAIL_PASSWORD,
    port: env.MAIL_PORT,
    requireTLS: env.MAIL_REQUIRE_TLS,
    secure: env.MAIL_SECURE,
    user: env.MAIL_USER,
  },
  client: {
    frontendUrl: env.CLIENT_FE_URL,
  },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },
};
