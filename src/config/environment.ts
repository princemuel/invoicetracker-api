import * as dotenv from 'dotenv-safe';
import { readFile } from '../lib/utils/files';

dotenv.config();

export const constants = {
  JWT_PUBLIC_KEY: readFile('public.pem'),
  JWT_PRIVATE_KEY: readFile('private.pem'),

  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '15',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '3',

  PORT: process.env.PORT || 4000,
  BASE_URL: process.env.BASE_URL || '',

  SMTP: {
    HOST: 'EMAIL_HOST',
    PASS: 'EMAIL_PASS',
    PORT: 'EMAIL_PORT',
    USER: 'EMAIL_USER',
  },
} as const;
