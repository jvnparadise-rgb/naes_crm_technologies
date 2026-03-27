import { json } from './lib/json.js';
import { handleHealth } from './routes/health.js';
import { handleDbCheck } from './routes/dbCheck.js';

export async function app(event) {
  const path = event?.rawPath || event?.path || '/';
  const method = event?.requestContext?.http?.method || event?.httpMethod || 'GET';

  if (method === 'GET' && path === '/health') {
    return json(200, await handleHealth());
  }

  if (method === 'GET' && path === '/db-check') {
    const result = await handleDbCheck();
    return json(result.ok ? 200 : 500, result);
  }

  return json(404, {
    ok: false,
    message: 'Route not found',
    method,
    path
  });
}
