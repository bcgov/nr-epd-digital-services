module.exports = {
  client: {
    service: {
      name: 'nr-site-registry',
      localSchemaFile: `./graphql.schema.json`,
    },
    includes: [`./src/**/*`],
    excludes: ['./src/graphql/generated.ts'],
  },
};
