import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { constants } from '../../config';
import type { JwtPayload } from '../../types';

type Key = 'AccessToken' | 'RefreshToken';

const jwtOptions: SignOptions = {
  issuer: constants.SERVER_URL,
  audience: constants.SERVER_URL,
};

/**
 *
 * @param payload JwtPayload
 * @param key AccessToken OR RefreshToken
 * @param options SignOptions
 * @returns string
 */
export const signJwt = (payload: JwtPayload, options?: SignOptions) => {
  const secret = constants.JWT_PRIVATE_KEY;
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
export const verifyJwt = (token: string) => {
  const secret = constants.JWT_PUBLIC_KEY;
  try {
    return jwt.verify(token, secret, {
      algorithms: ['RS256'],
    }) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export async function compare(data: string, encrypted: string) {
  return await bcrypt.compare(data, encrypted);
}

export async function hash(data: string, rounds = 12) {
  const salt = await bcrypt.genSalt(rounds);
  return await bcrypt.hash(data, salt);
}
