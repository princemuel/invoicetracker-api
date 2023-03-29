import { ApolloServerErrorCode } from '@apollo/server/errors';
import { Prisma } from '@prisma/client';
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
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new GraphQLError(
            'Invalid input: This email already exists, please use another email address',
            {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                http: { status: 409 },
              },
            }
          );
        }
      }
      return null;
    }
  },
});

export const login = mutationField('login', {
  type: nullable('AuthPayload'),
  args: {
    input: nonNull('LoginInput'),
  },
  resolve: async (_root, args, ctx) => {
    try {
      const cookies = ctx.req.cookies;
      console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

      const { email, password } = args.input;

      if (!email || !password) {
        throw new GraphQLError(
          'Invalid input: email and password are required',
          {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              http: { status: 400 },
            },
          }
        );
      }

      const user = await ctx.db.user.findUnique({
        where: {
          email: email.toLowerCase(),
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

      let refreshTokens = !cookies.jwt
        ? user.tokenArray
        : user.tokenArray.filter((rt) => rt !== cookies.jwt);

      return {
        user,
        accessToken,
      };
    } catch (error) {
      //! Make sure to test this scenario
      throw error;
    }
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
