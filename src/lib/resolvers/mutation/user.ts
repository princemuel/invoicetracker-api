import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
import { mutationField, nonNull, nullable } from 'nexus';
import {
  comparePassword,
  createTokens,
  getErrorMessage,
  getRefreshCookie,
  hashPassword,
  removeCookies,
} from '../../utils';

export const register = mutationField('register', {
  type: nullable('AuthPayload'),
  args: {
    input: nonNull('RegisterInput'),
  },
  resolve: async (_root, args, ctx) => {
    const { firstName, lastName, email, password } = args.input;

    if (!firstName || !lastName || !email || !password) {
      throw new GraphQLError(
        'Invalid input: firstName, lastName, email and password are required',
        {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            http: { status: 400 },
          },
        }
      );
    }

    const user = await ctx.db.user.create({
      data: {
        ...args.input,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password: await hashPassword(password.trim()),
      },
    });
    const { accessToken } = createTokens({ user: user.id }, ctx);

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

    const { accessToken } = createTokens({ user: user.id }, ctx);

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

    const message = 'Invalid user: This user was not found';
    if (!user)
      throw new GraphQLError(message, {
        extensions: {
          code: 'FORBIDDEN',
        },
      });

    const { accessToken } = createTokens({ user: user.id }, ctx);
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
