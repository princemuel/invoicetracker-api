import { inputObjectType } from 'nexus';

export const CreateInvoiceInput = inputObjectType({
  name: 'CreateInvoiceInput',
  definition(t) {
    t.string('description');
    t.string('tag');
    t.field('status', { type: 'Status' });
    t.int('paymentTerms');
    t.string('paymentDue');
    t.string('clientName');
    t.string('clientEmail');
    t.field('clientAddress', { type: AddressInput });
    t.field('senderAddress', { type: AddressInput });
    t.float('total');
    t.list.field('items', {
      type: InvoiceItemInput,
    });
  },
});

export const UpdateInvoiceInput = inputObjectType({
  name: 'UpdateInvoiceInput',
  definition(t) {
    t.string('description');
    t.field('status', { type: 'Status' });
    t.int('paymentTerms');
    t.string('paymentDue');
    t.string('clientName');
    t.string('clientEmail');
    t.field('clientAddress', { type: AddressInput });
    t.field('senderAddress', { type: AddressInput });
    t.float('total');
    t.list.field('items', { type: InvoiceItemInput });
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
    t.id('itemId');
    t.string('name');
    t.int('quantity');
    t.float('price');
    t.float('total');
  },
});

export const ItemWhereUniqueInput = inputObjectType({
  name: 'ItemWhereUniqueInput',
  definition(t) {
    t.nonNull.id('id');
  },
});
