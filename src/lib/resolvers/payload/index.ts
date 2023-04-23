import { objectType } from 'nexus';

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
    });
    t.nonNull.string('token');
  },
});

export const RefreshPayload = objectType({
  name: 'RefreshPayload',
  definition(t) {
    t.nonNull.string('token');
  },
});

export const LogoutPayload = objectType({
  name: 'LogoutPayload',
  definition(t) {
    t.nonNull.string('message');
  },
});
