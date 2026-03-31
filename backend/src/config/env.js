const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = { env };
