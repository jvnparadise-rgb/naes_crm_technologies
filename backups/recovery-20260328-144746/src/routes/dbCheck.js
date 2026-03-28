import { createDbClient } from '../db/client.js';

export async function handleDbCheck() {
  const client = createDbClient();

  try {
    await client.connect();

    const result = await client.query(`
      select
        now() as server_time,
        current_database() as db,
        current_user as db_user
    `);

    return {
      ok: true,
      service: 'naes-crm-api-dev',
      route: '/db-check',
      result: {
        ok: true,
        host: process.env.DB_HOST || null,
        port: Number(process.env.DB_PORT || 5432),
        dbName: process.env.DB_NAME || null,
        dbUser: process.env.DB_USER || null,
        queryResult: result.rows[0]
      }
    };
  } catch (err) {
    return {
      ok: false,
      service: 'naes-crm-api-dev',
      route: '/db-check',
      result: {
        ok: false,
        error: err.message
      }
    };
  } finally {
    try {
      await client.end();
    } catch {}
  }
}
