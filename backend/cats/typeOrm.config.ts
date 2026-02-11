import { DataSource } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(<string>process.env.POSTGRESQL_PORT) || 5432,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_DB_SCHEMA,
  synchronize: false,
  logging: true,
  entities: ['src/app/entities/**/!(*.spec).{js,ts}'], // Exclude .spec.ts files
  migrations: ['src/migrations/**/*.ts'],
});
