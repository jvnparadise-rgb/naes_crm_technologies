import { Client } from 'pg';
import { getEnv } from '../config/env.js';

export function createDbClient() {
  const env = getEnv();

  return new Client({
    host: env.dbHost,
    port: env.dbPort,
    database: env.dbName,
    user: env.dbUser,
    password: env.dbPassword,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
  });
}
