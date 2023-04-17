import { User } from '@prisma/client';
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
  locals: { user: User | null };
}
export interface JwtPayload extends jwt.JwtPayload {
  sub: string;
}
