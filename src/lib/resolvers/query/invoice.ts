import { GraphQLError } from 'graphql';
import { list, nonNull, nullable, queryField } from 'nexus';

export const invoices = queryField('invoices', {
  type: nonNull(list('Invoice')),
  resolve: async (root, args, ctx) => {
    try {
      const user = await ctx.getAuthUser(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      return await ctx.db.invoice.findMany({
        where: {
          userId: user.id,
        },
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  },
});

export const invoice = queryField('invoice', {
  type: nullable('Invoice'),
  args: {
    where: nonNull('UniqueIdInput'),
  },
  resolve: async (root, args, ctx) => {
    try {
      const user = await ctx.getAuthUser(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      return await ctx.db.invoice.findUniqueOrThrow({
        where: {
          id: args.where.id,
        },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});
