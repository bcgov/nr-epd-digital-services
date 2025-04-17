import { CodegenConfig } from '@graphql-codegen/cli';

require('dotenv').config();

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.SITE_SERVICE_URL_CODEGEN || process.env.SITE_SERVICE_URL,
  documents: ['src/**/*.graphql'],
  generates: {
    'src/generated/types.ts': {
      plugins: ['typescript'],
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'generated/types.ts',
      },
      plugins: ['typescript-operations', 'typescript-graphql-request'],
    },
    'graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
