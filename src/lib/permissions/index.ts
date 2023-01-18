import { ApolloServerErrorCode } from '@apollo/server/errors';
import { GraphQLError } from 'graphql';
import { allow, shield } from 'graphql-shield';
import { rules } from './rules';

export const permissions = shield(
  {
    Query: {
      // "*": isAuthenticated,
    },
    Mutation: {
      // "*": isAuthenticated,
      createInvoice: rules.isAuthenticated,
      deleteInvoice: rules.isAuthenticated,
    },
  },
  {
    fallbackRule: allow,

    async fallbackError(error, root, args, context, info) {
      if (
        error.extensions?.code === ApolloServerErrorCode.GRAPHQL_PARSE_FAILED
      );
      if (error instanceof ApolloError) {
        // expected errors
        return error;
      }
      if (error instanceof Error) {
        // unexpected errors
        console.error(error);
        return new GraphQLError(
          'Internal server error',
          'ERR_INTERNAL_SERVER_ERROR'
        );
      }
      // what the hell got thrown
      console.error('The resolver threw something that is not an error.');
      console.error(error);
      return new GraphQLError(
        'Internal server error',
        'ERR_INTERNAL_SERVER_UNKWOWN'
      );
    },
  }
);
