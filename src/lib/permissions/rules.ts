import { rule } from 'graphql-shield';
import { Context } from '../context';

export const rules = {
  isAuthenticated: rule({ cache: 'contextual' })(
    async (_root, _args, ctx: Context, _info) => {
      return ctx.user !== null;
    }
  ),
};
