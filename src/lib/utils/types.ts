import * as express from 'express';
import * as jwt from 'jsonwebtoken';

export type ExpressRequest = express.Request;
export type ExpressResponse = express.Response;
export interface JwtPayload extends jwt.JwtPayload {
  user: string;
}
