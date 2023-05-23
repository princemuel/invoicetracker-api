import { applyMiddleware } from 'graphql-middleware';
import { connectionPlugin, declarativeWrappingPlugin, makeSchema } from 'nexus';
import * as path from 'path';
import { permissions } from './permissions';
import { guardPlugin } from './plugins';
import * as types from './resolvers';

const baseSchema = makeSchema({
  types,
  plugins: [
    guardPlugin,
    declarativeWrappingPlugin({ disable: true }),
    connectionPlugin(),
  ],
  outputs: {
    typegen: path.join(
      process.cwd(),
      'node_modules',
      '@types',
      'nexus-gen',
      'index.d.ts'
    ),
    schema: path.join(process.cwd(), 'generated', 'schema.gql'),
  },
  contextType: {
    export: 'Context',
    module: path.join(process.cwd(), 'src', 'lib', 'context.ts'),
  },
  nonNullDefaults: {
    input: true,
    output: false,
  },
});

// export const schema = baseSchema;
export const schema = applyMiddleware(baseSchema, permissions);
