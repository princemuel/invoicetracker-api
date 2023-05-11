import cors from 'cors';

// const local = [/^http:\/\/localhost:\d{4}$/];
// const prod = [/^https:\/\/.*\.yourdomain\.com$/];
// const prod = constants.SERVER_URL;

const whitelist = [
  'https://invoicemail.vercel.app',
  'https://invoicemailer.onrender.com',
  'https://studio.apollographql.com',
  'http://localhost:4000',
  'http://localhost:3000',
];

// Cross Orign Resource Sharing
export const corsOptions = {
  origin: (origin, callback) => {
    //@ts-expect-error
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
} as cors.CorsOptions;
