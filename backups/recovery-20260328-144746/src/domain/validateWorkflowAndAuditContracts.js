import { opportunityWorkflowContract } from './opportunityWorkflowContract.js';
import { auditEventContract } from './auditEventContract.js';

export function validateWorkflowAndAuditContracts() {
  const requiredStages = ['Prospecting', 'Proposal', 'Quoted', 'Closed Won', 'Closed Lost'];
  for (const stage of requiredStages) {
    if (!opportunityWorkflowContract.stages.includes(stage)) {
      throw new Error(`Missing required opportunity stage: ${stage}`);
    }
  }

  const requiredStatuses = ['Open', 'Quoted', 'Won', 'Lost'];
  for (const status of requiredStatuses) {
    if (!opportunityWorkflowContract.statuses.includes(status)) {
      throw new Error(`Missing required opportunity status: ${status}`);
    }
  }

  const requiredAuditFields = ['entityType', 'entityId', 'actionType', 'changedByUserId', 'changedAt'];
  for (const field of requiredAuditFields) {
    if (!auditEventContract.requiredFields.includes(field)) {
      throw new Error(`Missing required audit field: ${field}`);
    }
  }

  if (!auditEventContract.requirements.timestampRequired) {
    throw new Error('Audit timestamps must be required.');
  }

  if (!auditEventContract.requirements.actingUserRequired) {
    throw new Error('Audit acting-user tracking must be required.');
  }

  return {
    ok: true,
    stageCount: opportunityWorkflowContract.stages.length,
    statusCount: opportunityWorkflowContract.statuses.length,
    auditFieldCount: auditEventContract.requiredFields.length,
    trackedEntityCount: auditEventContract.trackedEntities.length
  };
}
