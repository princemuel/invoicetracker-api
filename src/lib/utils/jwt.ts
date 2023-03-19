import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { constants } from '../../config';
import type { JwtPayload } from './types';

type Key = 'AccessToken' | 'RefreshToken';

const jwtOptions = {
  issuer: 'Invoice Mailer',
  audience: 'https://invoicemailer.onrender.com',
};
/**
 *
 * @param payload JwtPayload
 * @param key AccessToken OR RefreshToken
 * @param options SignOptions
 * @returns string
 */
export const signJwt = (
  payload: JwtPayload,
  key: Key,
  options?: SignOptions
) => {
  const accessToken = constants.JWT_ACCESS_SECRET;
  const refreshToken = constants.JWT_REFRESH_SECRET;

  const secret = key === 'AccessToken' ? accessToken : refreshToken;

  return jwt.sign(payload, secret, {
    ...(options ?? {}),
    ...jwtOptions,
    algorithm: 'RS256',
  });
};

/**
 *
 * @param token string
 * @param key AccessToken OR RefreshToken
 * @returns JwtPayload | null
 */
export const verifyJwt = (token: string, key: Key) => {
  const accessToken = constants.JWT_ACCESS_PUBLIC;
  const refreshToken = constants.JWT_REFRESH_PUBLIC;

  const secret = key === 'AccessToken' ? accessToken : refreshToken;

  try {
    return jwt.verify(token, secret, {
      algorithms: ['RS256'],
    }) as JwtPayload;
  } catch (error) {
    console.log('VERIFICATION ERROR', error);
    return null;
  }
};

export async function comparePassword(data: string, encrypted: string) {
  return await bcrypt.compare(data, encrypted);
}

export async function hashPassword(data: string, rounds = 12) {
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(data, salt);
}
