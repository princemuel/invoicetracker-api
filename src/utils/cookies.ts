import { User } from '@prisma/client';
import { CookieOptions } from 'express';
import { constants } from '../config';
import { Context } from '../lib';
import type { JwtPayload } from '../types';
import { signJwt } from './jwt';

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
  return signJwt(payload, {
    expiresIn: `${constants.JWT_ACCESS_EXPIRATION}m`,
  });
};

const createRefreshToken = (payload: JwtPayload) => {
  return signJwt(payload, {
    expiresIn: `${constants.JWT_REFRESH_EXPIRATION}d`,
  });
};

export const createTokens = (payload: JwtPayload, context: Context) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  const refreshExpiration =
    Number(constants.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000;

  const refreshOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(Date.now() + refreshExpiration),
  };

  context.res.cookie('jwt', refreshToken, refreshOptions);

  return { accessToken };
};

export function encodeAuthUser(user: User) {
  return { email: user.email, photo: user.photo, sub: user.id };
}

export const removeCookies = ({ res }: Context) => {
  res.clearCookie('jwt', { ...cookieOptions });
};
