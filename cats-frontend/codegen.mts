import { CodegenConfig } from '@graphql-codegen/cli';

import { loadEnv } from 'vite';
import { resolve } from 'path';

const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, resolve(__dirname, './'), '');

const config: CodegenConfig = {
  overwrite: true,
  schema: `${env.VITE_BACKEND_API || 'http://localhost:4005'}/graphql`,
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/types.ts': {
      plugins: ['typescript'],
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.tsx',
        baseTypesPath: 'generated/types.ts',
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: { withHooks: true },
    },
    'graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
