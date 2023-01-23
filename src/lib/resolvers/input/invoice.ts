import { inputObjectType } from 'nexus';

export const CreateInvoiceInput = inputObjectType({
  name: 'CreateInvoiceInput',
  definition(t) {
    t.nonNull.id('userId');
    t.nonNull.string('description');
    t.nonNull.string('tag');
    t.nonNull.field('status', { type: 'Status' });
    t.nonNull.int('paymentTerms');
    t.nonNull.string('paymentDue');
    t.nonNull.string('clientName');
    t.nonNull.string('clientEmail');
    t.nonNull.field('clientAddress', { type: 'AddressInput' });
    t.nonNull.field('senderAddress', { type: 'AddressInput' });
    t.nonNull.float('total');
    t.nonNull.list.nonNull.field('items', { type: 'InvoiceItemInput' });
  },
});

export const UpdateInvoiceInput = inputObjectType({
  name: 'UpdateInvoiceInput',
  definition(t) {
    t.nonNull.id('userId');
    t.nonNull.string('description');
    t.nonNull.field('status', { type: 'Status' });
    t.nonNull.int('paymentTerms');
    t.nonNull.string('paymentDue');
    t.nonNull.string('clientName');
    t.nonNull.string('clientEmail');
    t.nonNull.field('clientAddress', { type: 'AddressInput' });
    t.nonNull.field('senderAddress', { type: 'AddressInput' });
    t.nonNull.float('total');
    t.nonNull.list.nonNull.field('items', { type: 'InvoiceItemInput' });
  },
});

export const AddressInput = inputObjectType({
  name: 'AddressInput',
  definition(t) {
    t.string('street', { description: 'The street where the person resides' });
    t.string('city', { description: 'The city where the person lives in' });
    t.string('postCode', {
      description: "The post code of the person's state",
    });
    t.string('country', {
      description: 'The country where the person is located',
    });
  },
});

export const InvoiceItemInput = inputObjectType({
  name: 'InvoiceItemInput',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.nonNull.int('quantity');
    t.nonNull.float('price');
    t.nonNull.float('total');
  },
});

export const ItemWhereUniqueInput = inputObjectType({
  name: 'ItemWhereUniqueInput',
  definition(t) {
    t.nonNull.id('id');
  },
});
