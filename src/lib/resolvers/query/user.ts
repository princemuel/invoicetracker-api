import { nonNull, nullable, queryField } from 'nexus';

export const user = queryField('user', {
  type: nullable('User'),
  args: {
    where: nonNull('UniqueIdInput'),
  },
  resolve: async (root, args, ctx) => {
    return await ctx.createUserContext(ctx.req);
  },
});
