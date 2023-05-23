import { RequestHandler } from 'express';
import { whitelist } from '../config';

const credentials: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin!;
  if (whitelist.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
};

export { credentials };
