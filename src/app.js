import { json } from './lib/json.js';
import { handleHealth } from './routes/health.js';
import { handleDbCheck } from './routes/dbCheck.js';
import { handleListAccounts } from './routes/accounts.js';
import { handleListContacts } from './routes/contacts.js';
import { handleListOpportunities } from './routes/opportunities.js';
import { handleListTasks } from './routes/tasks.js';
import { handleListActivities } from './routes/activities.js';

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

  if (method === 'GET' && path === '/accounts') {
    return json(200, await handleListAccounts());
  }

  if (method === 'GET' && path === '/contacts') {
    return json(200, await handleListContacts());
  }

  if (method === 'GET' && path === '/opportunities') {
    return json(200, await handleListOpportunities());
  }

  if (method === 'GET' && path === '/tasks') {
    return json(200, await handleListTasks());
  }

  if (method === 'GET' && path === '/activities') {
    return json(200, await handleListActivities());
  }

  return json(404, {
    ok: false,
    message: 'Route not found',
    method,
    path
  });
}
