import cors from 'cors';
import { constants } from './environment';

const isDev = process.env.NODE_ENV === 'development';
const local = [/^http:\/\/localhost:\d{4}$/];
// const prod = [/^https:\/\/.*\.yourdomain\.com$/];
const prod = constants.BASE_URL;

// Cross Orign Resource Sharing
export const corsOptions = {
  // origin: (origin, callback) => {
  //   if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error('Not allowed by CORS'));
  //   }
  // },
  // origin: isDev ? local : prod,
  origin: [
    'https://studio.apollographql.com',
    'http://localhost:8000',
    'http://localhost:4000',
    'http://localhost:3000',
  ],
  // optionsSuccessStatus: 200,
  credentials: true,
} as cors.CorsOptions;
