import { objectType } from 'nexus';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token');
  },
});

export const MessagePayload = objectType({
  name: 'MessagePayload',
  definition(t) {
    t.nonNull.string('message');
  },
});
