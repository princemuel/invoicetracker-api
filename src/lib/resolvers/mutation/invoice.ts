import { GraphQLError } from 'graphql';
import produce from 'immer';
import { mutationField, nullable } from 'nexus';
import ShortUniqueId from 'short-unique-id';

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
      const user = await ctx.getAuthUser(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      const invoice = produce(args.input, (draft) => {
        draft.tag = suid.randomUUID(6);
      });

      return await ctx.db.invoice.create({
        data: invoice,
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
      const user = await ctx.getAuthUser(ctx.req);
      if (!user) {
        throw new GraphQLError('Invalid User: User not authorised', {
          extensions: {
            code: 'FORBIDDEN',
            http: { status: 403 },
          },
        });
      }

      return await ctx.db.invoice.update({
        where: { id: args.where.id },
        data: args.input,
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
      const user = await ctx.getAuthUser(ctx.req);
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
