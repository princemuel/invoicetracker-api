import { GraphQLError } from 'graphql';
import { mutationField, nonNull } from 'nexus';
import {
  comparePassword,
  createTokens,
  getRefreshCookie,
  hashPassword,
  removeRefreshCookie,
} from '../../utils';
import { AuthPayload, User } from './model/user';
import { LoginInput, RegisterInput } from './user.input';

export const register = mutationField('register', {
  type: nonNull(AuthPayload),
  args: {
    input: nonNull(RegisterInput),
  },
  resolve: async (_root, args, ctx) => {
    const user = await ctx.db.user.create({
      data: {
        ...args.input,
        email: args.input.email.toLowerCase(),
        password: await hashPassword(args.input.password),
      },
    });

    const { accessToken } = await createTokens({ sub: user.id }, ctx);
    return {
      user,
      accessToken,
    };
  },
});

export const login = mutationField('login', {
  type: nonNull(AuthPayload),
  args: {
    input: nonNull(LoginInput),
  },
  resolve: async (_root, args, ctx) => {
    const user = await ctx.db.user.findFirstOrThrow({
      where: {
        email: args.input.email.toLowerCase(),
      },
    });

    let message = 'Invalid user credentials';

    const matches = await comparePassword(args.input.password, user.password);
    if (!matches)
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });

    const { accessToken } = await createTokens({ sub: user.id }, ctx);
    return {
      // ! maybe return only the access token?
      user,
      accessToken,
    };
  },
});

export const refreshAuth = mutationField('refreshAuth', {
  type: nonNull(AuthPayload),
  resolve: async (_root, _args, ctx) => {
    const decoded = getRefreshCookie(ctx);
    const user = await ctx.db.user.findFirstOrThrow({
      where: {
        id: decoded.sub,
      },
    });

    const { accessToken } = await createTokens({ sub: user.id }, ctx);
    return {
      user,
      accessToken,
    };
  },
});

export const logout = mutationField('logout', {
  type: nonNull(User),
  resolve: async (_root, _args, ctx) => {
    let message = 'Invalid logout cookie. Could not find the access token';

    const decoded = getRefreshCookie(ctx);
    if (!decoded)
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

    removeRefreshCookie(ctx);
    return await ctx.db.user.findFirstOrThrow({
      where: {
        id: decoded.sub,
      },
    });
  },
});
