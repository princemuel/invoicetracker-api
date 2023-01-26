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
    // Same site true if frontend and backend are not separate
    // sameSite: 'lax',
  };
};

const cookieOptions = createCookieOptions();

const createAccessToken = <T extends {}>(payload: T) => {
  return signJwt(payload, 'RT', {
    expiresIn: `${constants.JWT_ACCESS_EXPIRATION}m`,
  });
};
const createRefreshToken = <T extends {}>(payload: T) => {
  return signJwt(payload, 'RT', {
    expiresIn: `${constants.JWT_REFRESH_EXPIRATION}d`,
  });
};

const createRefreshCookie = (token: string) => {
  const expirationMs =
    Number(constants.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000;

  const options: CookieOptions = {
    ...cookieOptions,
    sameSite: 'none',
    expires: new Date(Date.now() + expirationMs),
  };

  return ['jwt', token, options] as const;
};

export const createTokens = async (payload: JwtPayload, context: Context) => {
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  if (!!context) {
    const refreshCookie = createRefreshCookie(refreshToken);
    context.response.cookie(...refreshCookie);
  }

  return {
    accessToken,
    refreshToken,
  };
};

export function getRefreshCookie({ request }: Context) {
  let message = 'Invalid cookie: Could not find access token';

  const token = request?.cookies?.['jwt'] as string;
  if (!token) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'FORBIDDEN',
        http: { status: 403 },
      },
    });
  }

  message = 'Invalid cookie: No valid keys or signatures';
  const payload = verifyJwt(token, 'RT');
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

export const removeRefreshCookie = (context: Context) => {
  context.response.cookie('jwt', '', { expires: new Date() });
};

export function getUserId({ request }: Context) {
  let message = 'Invalid user: This user is not authorised';
  const Authorization = request.get('Authorization') || '';

  if (!Authorization) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  message = 'Invalid user: No access token found';
  const token = Authorization.replace('Bearer ', '');
  // if (!token) {
  //   throw new GraphQLError(message, {
  //     extensions: {
  //       code: 'UNAUTHENTICATED',
  //       http: { status: 401 },
  //     },
  //   });
  // }

  message = 'Invalid token: No valid key or signature';
  const payload = verifyJwt(token, 'AT');

  if (!payload) {
    throw new GraphQLError(message, {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }
  return payload.sub;
}
