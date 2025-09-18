import 'dotenv/config'
import mysql from 'mysql2/promise';

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME, 
    });
    const [r] = await conn.query('SELECT 1');
    console.log('OK', r);
    await conn.end();
  } catch (e: any) {
    console.error('FAIL', e.code, e.sqlMessage ?? e.message);
  }
})();
