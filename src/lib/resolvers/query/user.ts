import { nullable, queryField } from 'nexus';

export const user = queryField('user', {
  type: nullable('User'),
  resolve: async (root, args, ctx) => {
    return await ctx.createUserContext(ctx.req);
  },
});
