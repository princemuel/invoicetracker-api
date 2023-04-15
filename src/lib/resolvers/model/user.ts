import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id', { description: 'The GUID for the User' });
    t.nonNull.date('createdAt', {
      description: `The exact time the user was created`,
    });
    t.date('updatedAt', {
      description: `The exact time the user was updated`,
    });
    t.nonNull.string('email', { description: 'The email of the user' });
    t.string('password', { description: 'The password of the user' });
    t.string('photo', { description: 'The avatar of the user' });
    t.string('code', { description: `The user's verification code` });
    t.boolean('verified', {
      description: 'Defines whether the user is verifed or not',
    });
  },
});
