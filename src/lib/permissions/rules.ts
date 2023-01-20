import { rule } from 'graphql-shield';
import { Context } from '../context';
import { getUserId } from '../utils';

export const rules = {
  isAuthenticated: rule({ cache: 'contextual' })(
    async (root, args, ctx: Context, info) => {
      const userId = getUserId(ctx);

      const user = await ctx.db.user.findFirstOrThrow({
        where: {
          id: userId || undefined,
        },
      });

      return user != null;
    }
  ),
};
