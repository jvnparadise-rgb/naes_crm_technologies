export const auditEventContract = {
  entity: 'audit-event',

  requiredFields: [
    'id',
    'entityType',
    'entityId',
    'actionType',
    'changedByUserId',
    'changedByUserName',
    'changedAt',
    'changedDate',
    'changedTime'
  ],

  trackedEntities: [
    'opportunity',
    'quote',
    'pipeline'
  ],

  actionTypes: [
    'create',
    'update',
    'delete',
    'stage_change',
    'status_change',
    'quote_generated',
    'quote_updated'
  ],

  requirements: {
    timestampRequired: true,
    actingUserRequired: true,
    retentionRequired: true
  }
};
