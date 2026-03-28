export async function handleHealth() {
  return {
    ok: true,
    service: 'naes-crm-api-dev',
    route: '/health',
    message: 'Lambda is working'
  };
}
