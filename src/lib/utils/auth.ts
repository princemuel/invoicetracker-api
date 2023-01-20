import type { CookieOptions } from 'express';
import { GraphQLError } from 'graphql';
import type { Context } from '../context';
import { constants } from './environment';
import { signJwt, verifyJwt } from './jwt';

export type JwtPayload = {
  sub: string;
};

const createCookieOptions = (): CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    secure: isProd ? true : false,
    httpOnly: true,
    // domain: '/',
    // secure: true,
    // Same site true if frontend and backend are not separate
    sameSite: 'lax',
  };
};

const cookieOptions = createCookieOptions();

export const createTokens = async (payload: JwtPayload, context: Context) => {
  const accessToken = signJwt(payload, 'RT', {
    expiresIn: `${constants.JWT_ACCESS_EXPIRATION}m`,
  });
  context.response.cookie('access_token', accessToken, {
    ...cookieOptions,
    sameSite: 'none',
    expires: new Date(
      Date.now() + Number(constants.JWT_ACCESS_EXPIRATION) * 60 * 1000
    ),
    maxAge: Number(constants.JWT_ACCESS_EXPIRATION) * 60 * 1000,
  });

  const refreshToken = signJwt(payload, 'RT', {
    expiresIn: `${constants.JWT_ACCESS_EXPIRATION}d`,
  });
  context.response.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    sameSite: 'none',
    expires: new Date(
      Date.now() +
        Number(constants.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000
    ),
    maxAge: Number(constants.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export function getRefreshCookie({ request }: Context) {
  let message = 'Invalid token: Could not find access token';

  const token = request?.cookies?.['refresh_token'];
  if (!token) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  message = 'Invalid token: No valid keys or signatures';
  const payload = verifyJwt(token, 'RT');
  if (!payload) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }

  return payload;
}

export const removeRefreshCookie = (context: Context) => {
  const res = context?.response;
  res.cookie('access_token', '', { maxAge: 1 });
  res.cookie('refresh_token', '', { maxAge: 1 });
  context.user = null;
};

export function getUserId({ request }: Context) {
  let token: any;
  let message = 'Invalid user: No access token found';
  const Authorization = request.headers?.['authorization'];
  const isAuthorized = Authorization?.startsWith('Bearer ');

  if (isAuthorized) {
    token = Authorization?.split(' ')[1];
  } else if (request?.cookies?.['access_token']) {
    token = request.cookies['access_token'];
  }

  if (!token) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  message = 'Invalid token: No valid keys or signatures';

  const payload = verifyJwt(token, 'AT');
  if (!payload) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
      },
    });
  }
  return payload.sub;
}
