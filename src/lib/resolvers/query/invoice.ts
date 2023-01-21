import { list, nonNull, nullable, queryField } from 'nexus';

export const invoices = queryField('invoices', {
  type: nonNull(list(nonNull('Invoice'))),
  resolve: async (root, args, ctx) => {
    return ctx.db.invoice.findMany({});
  },
});

export const invoice = queryField('invoice', {
  type: nullable('Invoice'),
  args: {
    where: nonNull('ItemWhereUniqueInput'),
  },
  resolve: async (root, args, ctx) => {
    return ctx.db.invoice.findUniqueOrThrow({
      where: {
        id: args.where.id,
      },
    });
  },
});
