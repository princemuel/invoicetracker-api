import { allow, shield } from 'graphql-shield';
import { rules } from './rules';

export const permissions = shield({
  Query: {
    '*': rules.isAuthenticated,
    refreshAuth: allow,
  },
  Mutation: {
    '*': rules.isAuthenticated,
    login: allow,
    register: allow,
    logout: allow,
  },
});
