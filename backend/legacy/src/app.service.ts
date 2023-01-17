/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const oracledb = require('oracledb');
require('dotenv').config();
/**
 * Sample Service Class for App Controller
 */
@Injectable()
export class AppService {
  async getConnection(): Promise<string> {
    const connection = await oracledb
      .getConnection({
        user: process.env.ORACLE_USER,
        password: process.env.ORACLE_PASSWORD,
        connectString: process.env.ORACLE_CONN_STRING,
      })
      .then(function (connection) {
        console.log('Successfully connected to Oracle Database', connection);
        connection.close();
      })
      .catch(function (err) {
        console.log(err);
        throw new Error(err);
      });
    return 'Successfully connected to Oracle Database';
  }
}
