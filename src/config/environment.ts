import { parseBuffer } from '../lib/utils/files';

export const constants = {
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  PORT: process.env.PORT || 4000,
  SERVER_URL: process.env.SERVER_URL || '',
  SMTP: {
    HOST: 'EMAIL_HOST',
    PASS: 'EMAIL_PASS',
    PORT: 'EMAIL_PORT',
    USER: 'EMAIL_USER',
  },
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '3',

  JWT_PUBLIC_KEY: parseBuffer(process.env.JWT_PUBLIC_KEY!, 'base64', 'ascii'),
  JWT_PRIVATE_KEY: parseBuffer(process.env.JWT_PRIVATE_KEY!, 'base64', 'ascii'),
} as const;
