import { GraphQLError } from 'graphql';
import produce from 'immer';
import { mutationField, nullable } from 'nexus';
import ShortUniqueId from 'short-unique-id';
import { MESSAGES } from '../../../config';

const suid = new ShortUniqueId({
  dictionary: 'hex',
});

export const createInvoice = mutationField('createInvoice', {
  type: nullable('Invoice'),
  args: { input: 'CreateInvoiceInput' },
  resolve: async (_root, args, ctx) => {
    const user = await ctx.getAuthUser(ctx.req);
    if (!user) {
      throw new GraphQLError(MESSAGES.SESSION_UNAUTHORIZED, {
        extensions: {
          code: 'FORBIDDEN',
          http: { status: 403 },
        },
      });
    }

    const invoice = produce(args.input, (draft) => {
      draft.tag = suid.randomUUID(6);
    });

    return (
      (await ctx.db.invoice.create({
        data: invoice,
      })) || null
    );
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
      (await ctx.db.invoice.update({
        where: { id: args.where.id },
        data: args.input,
      })) || null
    );
  },
});

export const deleteInvoice = mutationField('deleteInvoice', {
  type: nullable('Invoice'),
  args: {
    where: 'UniqueIdInput',
  },
  resolve: async (_root, args, ctx) => {
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
      (await ctx.db.invoice.delete({
        where: args.where,
      })) || null
    );
  },
});
