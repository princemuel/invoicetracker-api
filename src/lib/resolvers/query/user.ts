import { GraphQLError } from 'graphql';
import { nullable, queryField } from 'nexus';
import { createTokens, encodeAuthUser, verifyJwt } from '../../utils';

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
