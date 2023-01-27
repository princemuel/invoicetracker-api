import { GraphQLError } from 'graphql';
import produce from 'immer';
import { mutationField, nullable } from 'nexus';
import ShortUniqueId from 'short-unique-id';
import { createUserContext } from '../../utils';

const suid = new ShortUniqueId({
  dictionary: 'hex',
});

export const createInvoice = mutationField('createInvoice', {
  type: 'Invoice',
  args: { input: 'CreateInvoiceInput' },
  resolve: async (_root, args, ctx) => {
    try {
      const user = await createUserContext(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      const nextState = produce(args.input, (draft) => {
        const dueTime = 86400 * 1000 * Number(draft?.paymentTerms || 1);

        draft.tag = suid.randomUUID(6);
        draft.paymentDue = new Date(Date.now() + dueTime).toISOString();
        draft.items.forEach((item) => {
          item.id = new ShortUniqueId().randomUUID(32);
        });

        draft.userId = user.id;
      });

      return ctx.db.invoice.create({
        data: nextState,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});

export const updateInvoice = mutationField('updateInvoice', {
  type: nullable('Invoice'),
  args: {
    input: 'UpdateInvoiceInput',
    where: 'UniqueIdInput',
  },
  resolve: async (_root, args, ctx) => {
    try {
      const user = await createUserContext(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }
      const nextState = produce(args.input, (draft) => {
        const dueTime = 86400 * 1000 * Number(draft?.paymentTerms || 1);
        draft.paymentDue = new Date(Date.now() + dueTime).toISOString();
      });

      return ctx.db.invoice.update({
        where: { id: args.where.id },
        data: nextState,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});

export const deleteInvoice = mutationField('deleteInvoice', {
  type: nullable('Invoice'),
  args: {
    where: 'UniqueIdInput',
  },
  resolve: async (_root, args, ctx) => {
    try {
      const user = await createUserContext(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      return ctx.db.invoice.delete({
        where: args.where,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});
