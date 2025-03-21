module.exports = {
  client: {
    service: {
      name: 'CATS',
      localSchemaFile: `./graphql.schema.json`,
    },
    includes: [`./src/**/*`],
    excludes: ['./src/**/*.generated.ts'],
  },
};
