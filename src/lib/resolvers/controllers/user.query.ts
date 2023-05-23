import { GraphQLError } from 'graphql';
import { nonNull, nullable, queryField } from 'nexus';
import { MESSAGES } from '../../../config';
import {
  createTokens,
  encodeAuthUser,
  removeCookies,
  verifyJwt,
} from '../../../utils';

export const user = queryField('user', {
  type: nullable('User'),
  resolve: async (root, args, ctx) => {
    return (await ctx.getAuthUser(ctx.req)) || null;
  },
});

export const refreshAuth = queryField('refreshAuth', {
  type: nullable('AuthPayload'),
  resolve: async (_root, _args, ctx) => {
    const token =
      ctx.req.get('Authorization')?.split?.(' ')?.[1] || ctx.req.cookies?.jwt;

    if (!token) {
      throw new GraphQLError(MESSAGES.SESSION_EXPIRED, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    const decoded = verifyJwt(token);
    if (!decoded) {
      throw new GraphQLError(MESSAGES.SESSION_INVALID_TOKEN, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    const user = await ctx.db.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    //  if (!user || !user.verified) {
    if (!user)
      throw new GraphQLError(MESSAGES.INPUT_INVALID_EMAIL, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });

    const data = encodeAuthUser(user);
    const { accessToken } = createTokens(data, ctx);
    return {
      token: accessToken,
    };
  },
});

export const logout = queryField('logout', {
  type: nonNull('MessagePayload'),
  resolve: async (_root, _args, ctx) => {
    try {
      const cookies = ctx.req.cookies;
      if (!(cookies?.jwt || cookies?.token)) {
        throw new GraphQLError(MESSAGES.SESSION_UNAUTHORIZED, {
          extensions: {
            code: 'NO_CONTENT',
            http: { status: 204 },
          },
        });
      }

      removeCookies(ctx);
      return {
        message: 'Logout successful',
      };
    } catch (error) {
      removeCookies(ctx);
      return {
        message: 'Logout successful',
      };
    }
  },
});
