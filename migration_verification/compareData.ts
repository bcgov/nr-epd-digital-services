import * as dotenv from 'dotenv';
dotenv.config();
import * as sql from 'mssql';
import type { config } from 'mssql';
const { Client } = require('pg');

// --- SQL Server (NTLM) Config ---
const sqlServerConfig: config = {
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DB,
    port: Number(process.env.SQL_PORT),
    user: process.env.SQL_USER,                  // NTLM user
    password: process.env.SQL_PASSWORD,   // NTLM password
    domain: process.env.SQL_DOMAIN,                 // important for NTLM
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
    }
};

// --- PostgreSQL Config ---
const pgClient = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT) || 5432,
});

// --- Helper: PascalCase → snake_case ---
function toSnakeCase(str: string): string {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
        .toLowerCase();
}

async function testConnection() {
    try {
        const pool = await sql.connect(sqlServerConfig);
        const result = await pool.request().query('SELECT GETDATE() AS now');
        console.log('Connected! Current time:', result.recordset[0].now);
        await pool.close();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

async function compareAllTableRowCounts(): Promise<void> {
    const pool = new sql.ConnectionPool(sqlServerConfig);
    try {
        await pool.connect();
        await pgClient.connect();

        // Get all SQL Server table names
        const tableQuery = `
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_SCHEMA = 'dbo'
    `;

        const result = await pool.request().query(tableQuery);
        const tableNames: string[] = result.recordset.map((row: any) => row.TABLE_NAME);

        //console.log('tableNames', tableNames);
        console.log(`\n${'SQL Table'.padEnd(30)} ${'Postgres Table'.padEnd(30)} SQL Count  PG Count   Match`);
        console.log('-'.repeat(85));

        let pgTableNotFound = [];
        let sqlTableNotFound = [];
        for (const sqlTable of tableNames) {
            const pgTable = toSnakeCase(sqlTable);
            let sqlCount;
            let pgCount;
            //console.log('pgTable', pgTable);
            try {
                const sqlRes = await pool.request().query(`SELECT COUNT(*) AS count FROM [${sqlTable}]`);
                sqlCount = Number(sqlRes.recordset[0].count);
            } catch (e) {
                sqlTableNotFound.push(pgTable);
                //console.warn(`Could not query SQL Server table: ${sqlTable}`);
            }

            try {
                const pgRes = await pgClient.query(`SELECT COUNT(*) FROM cats."${pgTable}"`);
                pgCount = Number(pgRes.rows[0].count);
            } catch (e) {
                pgTableNotFound.push(pgTable);
                //console.warn(`Could not query Postgres table: ${pgTable}`);
            }


            const match = sqlCount === pgCount ? '✅' : '❌';
            //if (sqlCount !== pgCount)
            console.log(`${sqlTable.padEnd(30)} ${pgTable.padEnd(30)} ${String(sqlCount).padEnd(10)} ${String(pgCount).padEnd(10)} ${match}`);
        }

        if (sqlTableNotFound.length > 0) {
            console.log('-'.repeat(85));
            console.log('Table not in Oracle:');
            console.log('-'.repeat(85));
            sqlTableNotFound.forEach((table) => {
                console.log(table);
            });
        }

        if (pgTableNotFound.length > 0) {
            console.log('-'.repeat(85));
            console.log('Table not in Postgres:');
            console.log('-'.repeat(85));
            pgTableNotFound.forEach((table) => {
                console.log(table);
            });
        }
    } catch (err) {
        console.error('🚨 Connection or query failed:', err);
    } finally {
        await pool.close();       // Close the SQL Server connection pool properly
        await pgClient.end();     // Close Postgres client connection
    }
}


compareAllTableRowCounts();
