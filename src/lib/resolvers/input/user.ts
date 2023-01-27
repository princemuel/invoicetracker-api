import { inputObjectType } from 'nexus';

export const RegisterInput = inputObjectType({
  name: 'RegisterInput',
  definition(t) {
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('email');
    t.nonNull.string('password', {
      description:
        'The password of the user. Must match the countersign i.e the reentered password',
    });
    t.nullable.string('countersign', {
      description: 'The reentered password to confirm that the passwords match',
    });
  },
});

export const LoginInput = inputObjectType({
  name: 'LoginInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
  },
});
