import { GraphQLError } from 'graphql';
import { nonNull, nullable, queryField } from 'nexus';
import {
  createTokens,
  encodeAuthUser,
  getErrorMessage,
  removeCookies,
  verifyJwt,
} from '../../utils';

export const user = queryField('user', {
  type: nullable('User'),
  resolve: async (root, args, ctx) => {
    return await ctx.getAuthUser(ctx.req);
  },
});

export const refreshAuth = queryField('refreshAuth', {
  type: 'RefreshPayload',
  resolve: async (_root, _args, ctx) => {
    let message = 'Invalid Token: Could not refresh access token';

    const token =
      ctx.req.get('Authorization')?.split(' ')[1] || ctx.req.cookies?.jwt;

    if (!token) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    message = 'Invalid Token: No valid keys or signatures';
    const decoded = verifyJwt(token);
    if (!decoded) {
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    message = 'Invalid user: This user was not found';
    const user = await ctx.db.user.findUnique({
      where: {
        id: decoded.sub,
      },
    });

    //  if (!user || !user.verified) {
    if (!user)
      throw new GraphQLError(message, {
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
  type: nonNull('LogoutPayload'),
  resolve: async (_root, _args, ctx) => {
    try {
      const cookies = ctx.req.cookies;
      if (!(cookies?.jwt || cookies?.token)) {
        throw new GraphQLError(
          'Invalid cookie: Could not find the access token',
          {
            extensions: {
              code: 'NO_CONTENT',
              http: { status: 204 },
            },
          }
        );
      }

      removeCookies(ctx);
      return {
        message: 'Logout successful',
      };
    } catch (error) {
      removeCookies(ctx);
      return {
        message: getErrorMessage(error),
      };
    }
  },
});
