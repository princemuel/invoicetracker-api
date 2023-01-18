import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from './auth';
import { constants } from './environment';
import { toBase64, toUtf8 } from './parsers';

type Key = 'AT' | 'RT';

const jwtOptions = {
  issuer: 'invoicemailer',
  audience: 'https://invoicemailer.onrender.com',
};
/**
 *
 * @param payload JwtPayload
 * @param key "AT" | "RT"
 * @param options SignOptions
 * @returns string
 */
export const signJwt = (
  payload: JwtPayload,
  key: Key,
  options?: SignOptions
) => {
  const accessToken = toBase64(constants.JWT_ACCESS_SECRET);
  const refreshToken = toBase64(constants.JWT_REFRESH_SECRET);
  const secret = key === 'AT' ? toUtf8(accessToken) : toUtf8(refreshToken);

  return jwt.sign(payload, secret, {
    ...(options ?? {}),
    ...jwtOptions,
    algorithm: 'RS256',
  });
};

/**
 *
 * @param token string
 * @param key "AT" | "RT"
 * @returns JwtPayload | null
 */
export const verifyJwt = (token: string, key: Key) => {
  const accessToken = toBase64(constants.JWT_ACCESS_PUBLIC);
  const refreshToken = toBase64(constants.JWT_REFRESH_PUBLIC);
  const secret = key === 'AT' ? toUtf8(accessToken) : toUtf8(refreshToken);

  try {
    return jwt.verify(token, secret, {
      ...jwtOptions,
      algorithms: ['RS256'],
    }) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export async function comparePassword(data: string, hashed: string) {
  return await bcrypt.compare(data, hashed);
}

export async function hashPassword(data: string) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(data, salt);
}
