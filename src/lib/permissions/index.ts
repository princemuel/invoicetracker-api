import { GraphQLError } from 'graphql';
import { allow, shield } from 'graphql-shield';
import { rules } from './rules';

export const permissions = shield(
  {
    Query: {
      '*': rules.isAuthenticated,
    },
    Mutation: {
      '*': rules.isAuthenticated,
      login: allow,
      register: allow,
      refreshAuth: allow,
      logout: allow,
    },
  },
  {
    fallbackRule: allow,
    async fallbackError(error, root, args, ctx, info) {
      if (error instanceof GraphQLError) {
        // expected errors
        return error;
      }
      if (error instanceof Error) {
        // unexpected errors
        console.error(error);
        return new GraphQLError('Error: Internal server error', {
          extensions: {
            code: 'ERR_INTERNAL_SERVER_ERROR',
            message: error.message,
          },
        });
      }
      // what the hell got thrown
      console.error('The resolver threw something that is not an error.');
      console.error(error);
      return new GraphQLError('Unknown: Internal server error', {
        extensions: { code: 'ERR_INTERNAL_SERVER_UNKWOWN' },
      });
    },
  }
);
