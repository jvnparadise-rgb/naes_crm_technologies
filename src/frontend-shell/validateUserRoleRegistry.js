import { userRoleRegistry } from './userRoleRegistry.js';

export function validateUserRoleRegistry() {
  const requiredKeys = ['ADMIN', 'EXECUTIVE', 'SALES_MANAGER', 'SALES_ASSOCIATE'];

  for (const key of requiredKeys) {
    if (!userRoleRegistry[key]) {
      throw new Error(`Missing user role: ${key}`);
    }
  }

  if (userRoleRegistry.ADMIN.fullAccess !== true) {
    throw new Error('Admin must have full access.');
  }

  return {
    ok: true,
    roleCount: Object.keys(userRoleRegistry).length,
    adminLabel: userRoleRegistry.ADMIN.label
  };
}
