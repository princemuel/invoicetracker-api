import type { CookieOptions, Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import type { Context } from '../lib';

import { constants } from './environment';
import { signJwt, verifyJwt } from './jwt';

export type JwtPayload = {
  sub: string;
};

type GetUserIdContext = {
  request: Request;
  response: Response;
};

export const createCookieOptions = (): CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    secure: isProd ? true : false,
    httpOnly: true,
    // domain: '/',
    // secure: true,
    // Same site if frontend and backend are not separate
    sameSite: 'lax',
  };
};

export const createAccessToken = (payload: JwtPayload) => {
  return signJwt(payload, 'AT', {
    subject: payload.sub,
    expiresIn: constants.JWT_ACCESS_EXPIRATION,
  });
};

export const createRefreshToken = (payload: JwtPayload) => {
  return signJwt(payload, 'RT', {
    subject: payload.sub,
    expiresIn: constants.JWT_REFRESH_EXPIRATION,
  });
};

export const createTokens = async (payload: JwtPayload, context: Context) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);
  console.log(accessToken);
  console.log(refreshToken);

  const cookieOptions = createCookieOptions();

  const res = context?.response;

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    expires: new Date(
      Date.now() + Number(constants.JWT_ACCESS_EXPIRATION) * 60 * 1000
    ),
    maxAge: Number(constants.JWT_ACCESS_EXPIRATION) * 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    expires: new Date(
      Date.now() + Number(constants.JWT_REFRESH_EXPIRATION) * 60 * 1000
    ),
    maxAge: Number(constants.JWT_REFRESH_EXPIRATION) * 60 * 1000,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export function getRefreshCookie({
  request,
}: Pick<GetUserIdContext, 'request'>) {
  let message = 'Invalid auth cookie. Could not find the access token';

  const token = request?.cookies?.['refresh_token'];
  if (!token) throw new Error(message);

  const payload = verifyJwt(token, 'RT');
  if (!payload)
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });

  return payload;
}

export const removeRefreshCookie = (context: Context) => {
  const res = context?.response;
  res.cookie('access_token', '', { maxAge: 1 });
  res.cookie('refresh_token', '', { maxAge: 1 });
  context.user = null;
};

export function getUserId({ request, response }: GetUserIdContext) {
  let token: any;
  const Authorization = request.headers?.['authorization'];
  console.log('TOKEN', Authorization);

  if (Boolean(Authorization) && Authorization?.startsWith('Bearer ')) {
    token = Authorization?.split(' ')[1];
  } else if (request.cookies.access_token) {
    token = request.cookies?.['access_token'];
  }

  if (!token) {
    throw new GraphQLError('No access token was found', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const decoded = verifyJwt(token, 'AT');
  return decoded && decoded.sub;
}
