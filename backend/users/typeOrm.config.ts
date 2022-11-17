import { DataSource } from "typeorm"

require('dotenv').config()

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port:  parseInt(<string> process.env.POSTGRESQL_PORT) || 5432,
  username: process.env.PROSGRES_DB_USERNAME,
  password: process.env.PROSGRES_DB_PASSWORD,
  database: process.env.PROSGRES_DATABASE,
  schema: process.env.PROSGRES_DB_SCHEMA,
  synchronize: false,
  logging: false,
  entities: [
    'src/users/entities/**/*.ts'
  ],
  migrations: [
    'migration/**/*.ts'
  ]  
})   