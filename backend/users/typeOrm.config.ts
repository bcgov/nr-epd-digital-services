import { DataSource } from "typeorm"

require('dotenv').config()

console.log("process.env.POSTGRES_DB_PASSWORD",process.env.POSTGRES_DB_PASSWORD)

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRESQL_HOST,
  port:  parseInt(<string> process.env.POSTGRESQL_PORT) || 5432,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  schema: process.env.POSTGRES_DB_SCHEMA,
  synchronize: false,
  logging: true,
  entities: [
    'src/users/entities/**/*.{js,ts}'
  ],
  migrations: [
    'migrations/**/*.ts'
  ]  
})   