export function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    dbHost: process.env.DB_HOST || '',
    dbPort: Number(process.env.DB_PORT || 5432),
    dbName: process.env.DB_NAME || 'postgres',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    awsRegion: process.env.AWS_REGION || 'us-east-1'
  };
}
