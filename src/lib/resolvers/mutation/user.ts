import { ApolloServerErrorCode } from '@apollo/server/errors';
import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import produce from 'immer';
import { mutationField, nonNull, nullable } from 'nexus';
import {
  compare,
  createTokens,
  createVerificationCode,
  getErrorMessage,
  gravatar,
  hash,
  removeCookies,
} from '../../utils';

export const register = mutationField('register', {
  type: nullable('AuthPayload'),
  args: {
    input: nonNull('RegisterInput'),
  },
  resolve: async (_root, args, ctx) => {
    try {
      const { email, password } = args.input;

      if (!email || !password) {
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

      const hashed = await hash(password);

      const draft = produce(args.input, (draft) => {
        draft.email = email.toLowerCase();
        draft.password = hashed;
        draft.photo = gravatar(email);
        draft.code = createVerificationCode();
      });

      const user = await ctx.db.user.create({
        data: draft,
      });

      const data = { email: user.email, photo: user.photo, sub: user.id };
      const { accessToken } = createTokens(data, ctx);
      ctx.res.locals.user = user;

      return {
        user,
        token: accessToken,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new GraphQLError(
            'Invalid Input: This email already exists, please use another email address',
            {
              extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
                http: { status: 409 },
              },
            }
          );
        }
      }
      console.log(error);
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
      // const cookies = ctx.req.cookies;
      // console.log(`cookies available at login: ${JSON.stringify(cookies)}`);

      const { email, password } = args.input;
      if (!email || !password)
        throw new GraphQLError(
          'Invalid input: email and password are required',
          {
            extensions: {
              code: ApolloServerErrorCode.BAD_USER_INPUT,
              http: { status: 400 },
            },
          }
        );

      const user = await ctx.db.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      let message = 'Invalid Email: This user was not found';
      //  if (!user || !user.verified) {
      if (!user)
        throw new GraphQLError(message, {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });

      message = 'Invalid Password: The user credentials do not match';
      const match = await compare(args.input.password, user.password);
      if (!match)
        throw new GraphQLError(message, {
          extensions: {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          },
        });

      const data = { email: user.email, photo: user.photo, sub: user.id };
      const { accessToken } = createTokens(data, ctx);
      ctx.res.locals.user = user;

      return {
        user,
        token: accessToken,
      };
    } catch (error) {
      //! Make sure to test this scenario
      console.log(error);
      return null;
    }
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
