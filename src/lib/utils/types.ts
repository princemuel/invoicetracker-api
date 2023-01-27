import * as express from 'express';

export type ApiRequest = express.Request;
export type ApiResponse = express.Response;
export type JwtPayload = {
  user: string;
};
