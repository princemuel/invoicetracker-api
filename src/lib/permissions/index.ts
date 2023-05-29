import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
import { allow, shield } from 'graphql-shield';
import { rules } from './rules';

export const permissions = shield(
  {
    Query: {
      '*': rules.isAuthenticated,
      refresh: allow,
      logout: allow,
    },
    Mutation: {
      '*': rules.isAuthenticated,
      login: allow,
      register: allow,
    },
  },

  {
    allowExternalErrors: true,
    async fallbackError(error, parent, args, context, info) {
      if (error instanceof GraphQLError) {
        return error;
      }

      if (error instanceof Error) {
        return new GraphQLError(`${error.message}`, {
          extensions: {
            code: ApolloServerErrorCode.BAD_REQUEST,
            http: { status: 400 },
          },
        });
      }

      // console.error('INTERNAL_SERVER_ERROR', error);
      return new GraphQLError('Internal Server Error', {
        extensions: {
          code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
          http: { status: 500 },
        },
      });
    },
  }
);
