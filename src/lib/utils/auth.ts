import type { CookieOptions } from 'express';
import { GraphQLError } from 'graphql';
import { constants } from '../../config/environment';
import type { Context } from '../context';
import { signJwt, verifyJwt } from './jwt';
import { JwtPayload } from './types';

const createCookieOptions = (): CookieOptions => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    secure: true,
    // secure: isProd ? true : false,
    httpOnly: true,
    sameSite: 'none',
  };
};

const cookieOptions = createCookieOptions();

const createAccessToken = (payload: JwtPayload) => {
  return signJwt(payload, 'AccessToken', {
    expiresIn: `${constants.JWT_ACCESS_EXPIRATION}m`,
  });
};

const createRefreshToken = (payload: JwtPayload) => {
  return signJwt(payload, 'RefreshToken', {
    expiresIn: `${constants.JWT_REFRESH_EXPIRATION}d`,
  });
};

const createCookies = (accessToken: string, refreshToken: string) => {
  const accessExpiration = Number(constants.JWT_ACCESS_EXPIRATION) * 60 * 1000;
  const refreshExpiration =
    Number(constants.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000;

  const accessOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + accessExpiration),
  };

  const refreshOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + refreshExpiration),
  };

  return [
    ['token', accessToken, accessOptions],
    ['jwt', refreshToken, refreshOptions],
  ] as const;
};

export const createTokens = (payload: JwtPayload, context: Context) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  if (context) {
    const [accessCookie, refreshCookie] = createCookies(
      accessToken,
      refreshToken
    );
    context.res.cookie(...accessCookie);
    context.res.cookie(...refreshCookie);
  }

  return {
    accessToken,
    refreshToken,
  };
};

export function getRefreshCookie({ req }: Context) {
  let message = 'Invalid Token: Could not refresh access token';

  const token = req?.cookies?.jwt;
  if (!token) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }

  message = 'Invalid Token: No valid keys or signatures';
  const payload = verifyJwt(token, 'RefreshToken');
  if (!payload) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }

  return payload;
}

export const removeCookies = ({ res }: Context) => {
  res.locals.user = null;
  res.clearCookie('token', { ...cookieOptions });
  res.clearCookie('jwt', { ...cookieOptions });
};
