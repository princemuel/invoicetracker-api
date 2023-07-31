import { User } from '@prisma/client';
import { CookieOptions } from 'express';
import produce from 'immer';
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
    // expiresIn: `${constants.JWT_ACCESS_EXPIRATION}m`,
    expiresIn: `${constants.JWT_ACCESS_EXPIRATION}s`,
  });
};

const createRefreshToken = (payload: JwtPayload) => {
  return signJwt(payload, {
    // expiresIn: `${constants.JWT_REFRESH_EXPIRATION}d`,
    expiresIn: `${constants.JWT_REFRESH_EXPIRATION}s`,
  });
};

const createCookies = (tokenA: string, tokenR: string) => {
  // const tokenAOptions = produce(cookieOptions, (draft) => {
  //   draft.maxAge = Number(constants.JWT_ACCESS_EXPIRATION) * 60 * 1000;
  // });
  // const tokenROptions = produce(cookieOptions, (draft) => {
  //   draft.maxAge =
  //     Number(constants.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000;
  // });
  const tokenAOptions = produce(cookieOptions, (draft) => {
    draft.maxAge = Number(constants.JWT_ACCESS_EXPIRATION) * 1000;
  });
  const tokenROptions = produce(cookieOptions, (draft) => {
    draft.maxAge = Number(constants.JWT_REFRESH_EXPIRATION) * 60 * 1000;
  });

  return [
    ['x-access-token', tokenA, tokenAOptions],
    ['jwt', tokenR, tokenROptions],
  ] as const;
};

export const createTokens = (payload: JwtPayload, context: Context) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  if (Boolean(context)) {
    const [accessCookie, refreshCookie] = createCookies(
      accessToken,
      refreshToken
    );

    context.res.cookie(...accessCookie);
    context.res.cookie(...refreshCookie);
  }

  return accessToken;
};

export function encodeAuthUser(user: User) {
  return { email: user.email, photo: user.photo, sub: user.id };
}

export const removeCookies = ({ res }: Context) => {
  res.clearCookie('x-access-token', { ...cookieOptions });
  res.clearCookie('jwt', { ...cookieOptions });
};
