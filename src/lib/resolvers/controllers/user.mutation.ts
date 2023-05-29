import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
import produce from 'immer';
import { mutationField, nonNull, nullable } from 'nexus';
import { MESSAGES } from '../../../config';
import {
  compare,
  createTokens,
  createVerificationCode,
  encodeAuthUser,
  gravatar,
  hash,
} from '../../../utils';

export const register = mutationField('register', {
  type: nullable('MessagePayload'),
  args: {
    input: nonNull('RegisterInput'),
  },
  resolve: async (_root, args, ctx) => {
    const { email, password } = args.input;
    if (!email || !password) {
      throw new GraphQLError(MESSAGES.INPUT_REQUIRED_USER, {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
          http: { status: 400 },
        },
      });
    }

    const duplicate = await ctx.db.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (duplicate)
      throw new GraphQLError(MESSAGES.INPUT_INVALID_DUPLICATE_EMAIL, {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
          http: { status: 409 },
        },
      });

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
    return {
      message: `New user ${user?.id} created`,
    };
  },
});

export const login = mutationField('login', {
  type: nullable('AuthPayload'),
  args: {
    input: nonNull('LoginInput'),
  },
  resolve: async (_root, args, ctx) => {
    const { email, password } = args.input;
    if (!email || !password)
      throw new GraphQLError(MESSAGES.INPUT_REQUIRED_USER, {
        extensions: {
          code: ApolloServerErrorCode.BAD_USER_INPUT,
          http: { status: 400 },
        },
      });

    const user = await ctx.db.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
    //  if (!user || !user.verified) {
    if (!user)
      throw new GraphQLError(MESSAGES.INPUT_INVALID_EMAIL, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });

    const match = await compare(password, user.password);
    if (!match)
      throw new GraphQLError(MESSAGES.INPUT_INVALID_PASSWORD, {
        extensions: {
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        },
      });

    const data = encodeAuthUser(user);
    const token = createTokens(data, ctx);

    return { token };
  },
});
