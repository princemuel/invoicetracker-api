import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export interface ExpressRequest extends Request {
  cookies: {
    jwt: string;
    token: string;
  };
}

export interface ExpressResponse extends Response {
  cookies?: {
    jwt: string;
    token: string;
  };
}
export interface JwtPayload extends jwt.JwtPayload {
  email: string;
  photo: string | null;
  sub: string;
}