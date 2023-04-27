import cors from 'cors';

// const local = [/^http:\/\/localhost:\d{4}$/];
// const prod = [/^https:\/\/.*\.yourdomain\.com$/];
// const prod = constants.SERVER_URL;

const allowedOrigins = [
  'https://pm-invoice.vercel.app/',
  'https://studio.apollographql.com',
  'http://localhost:4000',
  'http://localhost:3000',
];

// Cross Orign Resource Sharing
export const corsOptions = {
  origin: (origin, callback) => {
    // disallow origin for postman and other origin later
    if (allowedOrigins.includes(origin!) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
} as cors.CorsOptions;
