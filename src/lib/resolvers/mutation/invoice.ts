import produce from 'immer';
import { mutationField, nonNull } from 'nexus';
import ShortUniqueId from 'short-unique-id';

const suid = new ShortUniqueId({
  dictionary: 'hex',
});

export const createInvoice = mutationField('createInvoice', {
  type: nonNull('Invoice'),
  args: { input: 'CreateInvoiceInput' },
  resolve: async (_root, args, ctx) => {
    const nextState = produce(args.input, (draft) => {
      const dueTime = 86400 * 1000 * Number(draft?.paymentTerms || 1);

      draft.tag = suid.randomUUID(6);
      draft.paymentDue = new Date(Date.now() + dueTime).toISOString();
      draft.items.forEach((item) => {
        item.id = new ShortUniqueId().randomUUID(32);
      });
    });

    return ctx.db.invoice.create({
      data: nextState,
    });
  },
});

export const updateInvoice = mutationField('updateInvoice', {
  type: 'Invoice',
  args: {
    input: 'UpdateInvoiceInput',
    where: 'ItemWhereUniqueInput',
  },
  resolve: async (_root, args, ctx) => {
    const nextState = produce(args.input, (draft) => {
      const dueTime = 86400 * 1000 * Number(draft?.paymentTerms || 1);
      draft.paymentDue = new Date(Date.now() + dueTime).toISOString();
    });

    return ctx.db.invoice.update({
      where: { id: args.where.id },
      data: nextState,
    });
  },
});

export const deleteInvoice = mutationField('deleteInvoice', {
  type: 'Invoice',
  args: {
    where: 'ItemWhereUniqueInput',
  },
  resolve: async (_root, args, ctx) => {
    return ctx.db.invoice.delete({
      where: args.where,
    });
  },
});
