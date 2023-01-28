import { rule } from 'graphql-shield';
import { Context } from '../context';

export const rules = {
  isAuthenticated: rule({ cache: 'contextual' })(
    async (_root, _args, ctx: Context, _info) => {
      const user = await ctx.createUserContext(ctx.req);
      return user !== null;
    }
  ),
};
