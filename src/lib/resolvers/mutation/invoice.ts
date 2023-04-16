import { GraphQLError } from 'graphql';
import produce from 'immer';
import { mutationField, nullable } from 'nexus';
import ShortUniqueId from 'short-unique-id';
import { v4 as uuid } from 'uuid';

const suid = new ShortUniqueId({
  dictionary: 'hex',
});

/**
 * TODO: Refactor this controller and move frontend necessary code to frontend repo
 */

export const createInvoice = mutationField('createInvoice', {
  type: 'Invoice',
  args: { input: 'CreateInvoiceInput' },
  resolve: async (_root, args, ctx) => {
    try {
      const user = ctx.res.locals.user;
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      const draft = produce(args.input, (draft) => {
        const dueTime = 86400 * 1000 * Number(draft?.paymentTerms || 1);

        draft.tag = suid.randomUUID(6);
        draft.paymentDue = new Date(Date.now() + dueTime).toISOString();

        for (const item of draft?.items) {
          item.id = uuid();
        }

        draft.userId = user.id;
      });

      return await ctx.db.invoice.create({
        data: draft,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});

/**
 * TODO: Refactor this controller and move frontend necessary code to frontend repo
 */

export const updateInvoice = mutationField('updateInvoice', {
  type: nullable('Invoice'),
  args: {
    input: 'UpdateInvoiceInput',
    where: 'UniqueIdInput',
  },
  resolve: async (_root, args, ctx) => {
    try {
      const user = ctx.res.locals.user;
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }
      const draft = produce(args.input, (draft) => {
        const dueTime = 86400 * 1000 * Number(draft?.paymentTerms || 1);
        draft.paymentDue = new Date(Date.now() + dueTime).toISOString();
      });

      return await ctx.db.invoice.update({
        where: { id: args.where.id },
        data: draft,
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
      const user = ctx.res.locals.user;
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      return await ctx.db.invoice.delete({
        where: args.where,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  },
});
