import { inputObjectType } from 'nexus';

export const RegisterInput = inputObjectType({
  name: 'RegisterInput',
  definition(t) {
    t.nonNull.string('email', { description: 'The email of the user' });
    t.nonNull.string('password', {
      description:
        'The password of the user. Must match the countersign i.e the reentered password',
    });
    t.nullable.string('photo', {
      description: `The image url generated from the user's email address`,
    });
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.nonNull.string('email', { description: 'The email of the user' });
    t.nonNull.string('password', {
      description: 'The password of the user',
    });
  },
});
