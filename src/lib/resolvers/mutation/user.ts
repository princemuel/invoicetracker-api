import { GraphQLError } from 'graphql';
import { mutationField, nonNull } from 'nexus';
import {
  comparePassword,
  createTokens,
  getRefreshCookie,
  hashPassword,
  removeCookies,
} from '../../utils';

export const register = mutationField('register', {
  type: nonNull('AuthPayload'),
  args: {
    input: nonNull('RegisterInput'),
  },
  resolve: async (_root, args, ctx) => {
    const user = await ctx.db.user.create({
      data: {
        ...args.input,
        firstName: args.input.firstName.trim(),
        lastName: args.input.lastName.trim(),
        email: args.input.email.toLowerCase().trim(),
        password: await hashPassword(args.input.password.trim()),
      },
    });

    const { accessToken } = await createTokens({ user: user.id }, ctx);

    return {
      user,
      accessToken,
    };
  },
});

export const login = mutationField('login', {
  type: nonNull('AuthPayload'),
  args: {
    input: nonNull('LoginInput'),
  },
  resolve: async (_root, args, ctx) => {
    const user = await ctx.db.user.findUnique({
      where: {
        email: args.input.email.toLowerCase(),
      },
    });

    let message = 'Invalid email: This user was not found';
    if (!user)
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });

    message = 'Invalid input: user credentials do not match';
    const matches = await comparePassword(args.input.password, user.password);
    if (!matches)
      throw new GraphQLError(message, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });

    const { accessToken } = await createTokens({ user: user.id }, ctx);

    return {
      user,
      accessToken,
    };
  },
});

export const refreshAuth = mutationField('refreshAuth', {
  type: 'RefreshPayload',
  resolve: async (_root, _args, ctx) => {
    const decoded = getRefreshCookie(ctx);
    const user = await ctx.db.user.findUnique({
      where: {
        id: decoded.user,
      },
    });

    let message = 'Invalid user: This user was not found';
    if (!user)
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

    const { accessToken } = await createTokens({ user: user.id }, ctx);
    return {
      accessToken,
    };
  },
});

export const logout = mutationField('logout', {
  type: nonNull('LogoutPayload'),
  resolve: async (_root, _args, ctx) => {
    try {
      const cookies = ctx.req.cookies;
      if (!cookies?.jwt || !cookies?.token) {
        throw new GraphQLError(
          'Invalid cookie: Could not find the access token',
          {
            extensions: {
              code: 'FORBIDDEN',
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
        message: JSON.stringify(error),
      };
    }
  },
});
