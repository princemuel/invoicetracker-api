import { GraphQLError } from 'graphql';
import { nullable, queryField } from 'nexus';
import { createTokens, getRefreshCookie } from '../../utils';

export const user = queryField('user', {
  type: nullable('User'),
  resolve: async (root, args, ctx) => {
    return await ctx.createUserContext(ctx.req);
  },
});

export const refreshAuth = queryField('refreshAuth', {
  type: 'RefreshPayload',
  resolve: async (_root, _args, ctx) => {
    const decoded = getRefreshCookie(ctx);
    const user = await ctx.db.user.findUnique({
      where: {
        id: decoded.user,
      },
    });

    const message = 'Invalid user: This user was not found';
    if (!user)
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });

    const { accessToken } = createTokens({ user: user.id }, ctx);
    return {
      accessToken,
    };
  },
});
