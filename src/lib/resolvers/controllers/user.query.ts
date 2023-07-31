import { GraphQLError } from 'graphql';
import { nonNull, nullable, queryField } from 'nexus';
import { MESSAGES } from '../../../config';
import {
  createTokens,
  encodeAuthUser,
  removeCookies,
  verifyJwt,
} from '../../../utils';

export const refresh = queryField('refresh', {
  type: nullable('AuthPayload'),
  resolve: async (_root, _args, ctx) => {
    const jwt = ctx.req.cookies?.['jwt'];
    if (!jwt) {
      throw new GraphQLError(MESSAGES.SESSION_EXPIRED, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    const decoded = verifyJwt(jwt);
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
      throw new GraphQLError(MESSAGES.SESSION_INVALID_USER, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });

    const data = encodeAuthUser(user);
    const token = createTokens(data, ctx);

    return { token };
  },
});

export const logout = queryField('logout', {
  type: nonNull('MessagePayload'),
  resolve: async (_root, _args, ctx) => {
    const cookies = ctx.req.cookies;
    if (!cookies?.['x-access-token'] || !cookies?.['jwt']) {
      removeCookies(ctx); // still make sure the cookies are removed
      return {
        message: 'Logout successful',
      };
    }

    removeCookies(ctx);
    return {
      message: 'Logout successful',
    };
  },
});
