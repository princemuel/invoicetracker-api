import { GraphQLError } from 'graphql';
import { list, nonNull, nullable, queryField } from 'nexus';
import { MESSAGES } from '../../../config';

export const invoices = queryField('invoices', {
  type: nonNull(list('Invoice')),
  resolve: async (root, args, ctx) => {
    const user = await ctx.getAuthUser(ctx.req);
    if (!user) {
      throw new GraphQLError(MESSAGES.SESSION_UNAUTHORIZED, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    return (
      (await ctx.db.invoice.findMany({
        where: {
          userId: user.id,
        },
      })) || []
    );
  },
});

export const invoice = queryField('invoice', {
  type: nullable('Invoice'),
  args: {
    where: nonNull('UniqueIdInput'),
  },
  resolve: async (root, args, ctx) => {
    const user = await ctx.getAuthUser(ctx.req);
    if (!user) {
      throw new GraphQLError(MESSAGES.SESSION_UNAUTHORIZED, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    return (
      (await ctx.db.invoice.findUniqueOrThrow({
        where: {
          id: args.where.id,
        },
      })) || null
    );
  },
});
