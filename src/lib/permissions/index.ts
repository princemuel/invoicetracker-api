import { allow, shield } from 'graphql-shield';
import { rules } from './rules';

export const permissions = shield({
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
});
