import { readFile } from '../lib/utils/files';

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

  JWT_PUBLIC_KEY: readFile('public.pem'),
  JWT_PRIVATE_KEY: readFile('private.pem'),

  // JWT_PUBLIC_KEY:
  //   process.env.NODE_ENV !== 'production'
  //     ? readFile('public.pem')
  //     : process.env.JWT_PUBLIC_KEY!,
  // JWT_PRIVATE_KEY:
  //   process.env.NODE_ENV !== 'production'
  //     ? readFile('private.pem')
  //     : process.env.JWT_PRIVATE_KEY!,

  // JWT_PUBLIC_KEY:
  //   process.env.NODE_ENV === 'development'
  //     ? readFile('public.pem')
  //     : parseBuffer(process.env.JWT_PUBLIC_KEY!, 'base64', 'ascii'),
  // JWT_PRIVATE_KEY:
  //   process.env.NODE_ENV === 'development'
  //     ? readFile('private.pem')
  //     : parseBuffer(process.env.JWT_PRIVATE_KEY!, 'base64', 'ascii'),
} as const;

console.log(
  Object.entries(constants).map(([key, value]) => {
    return { key, value };
  })
);

// console.log({
//   PRIVATE_KEY: Buffer.from(readFile('private.pem')).toString('base64'),
//   PUBLIC_KEY: Buffer.from(readFile('public.pem')).toString('base64'),
// });
