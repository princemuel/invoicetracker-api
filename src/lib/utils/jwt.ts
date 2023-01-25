import * as bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload } from './auth';
import { constants } from './environment';

type Key = 'AT' | 'RT';

const jwtOptions = {
  issuer: 'Invoice Mailer',
  audience: 'https://invoicemailer.onrender.com',
};
/**
 *
 * @param payload T
 * @param key "AT" | "RT"
 * @param options SignOptions
 * @returns string
 */
export const signJwt = <T extends {}>(
  payload: T,
  key: Key,
  options?: SignOptions
) => {
  const accessToken = constants.JWT_ACCESS_SECRET;
  const refreshToken = constants.JWT_REFRESH_SECRET;

  const secret = key === 'AT' ? accessToken : refreshToken;

  return jwt.sign(payload, secret, {
    ...(options ?? {}),
    ...jwtOptions,
    algorithm: 'RS256',
    allowInsecureKeySizes: true,
  });
};

/**
 *
 * @param token string
 * @param key "AT" | "RT"
 * @returns JwtPayload | null
 */
export const verifyJwt = (token: string, key: Key) => {
  const accessToken = constants.JWT_ACCESS_SECRET;
  const refreshToken = constants.JWT_REFRESH_SECRET;

  const secret = key === 'AT' ? accessToken : refreshToken;

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
