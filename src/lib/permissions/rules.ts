import { rule } from 'graphql-shield';
import { Context } from '../context';
import { createUserContext } from '../utils';

export const rules = {
  isAuthenticated: rule({ cache: 'contextual' })(
    async (_root, _args, ctx: Context, _info) => {
      const { req } = ctx;
      const user = await createUserContext(req);
      return user !== null;
    }
  ),
};
