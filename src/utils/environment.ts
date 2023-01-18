import * as dotenv from 'dotenv-safe';

dotenv.config();
export const constants = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
  JWT_ACCESS_PUBLIC: process.env.JWT_ACCESS_PUBLIC || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_REFRESH_PUBLIC: process.env.JWT_REFRESH_PUBLIC || '',
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || '5 minutes',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '7 days',
};
