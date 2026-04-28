import { renderOpportunityHeaderBlock } from './renderOpportunityHeaderBlock.js';

export function validateOpportunityHeaderBlock() {
  const block = renderOpportunityHeaderBlock();

  if (block.type !== 'OpportunityHeaderBlock') {
    throw new Error('Opportunity header block did not initialize.');
  }

  if (!block.title || block.title !== 'Opportunities') {
    throw new Error('Opportunity header title is invalid.');
  }

  if (!block.entity || block.entity !== 'opportunity') {
    throw new Error('Opportunity header entity is invalid.');
  }

  if (block.summary.serviceToggleCount !== 4) {
    throw new Error('Opportunity header service toggle count is invalid.');
  }

  return {
    ok: true,
    title: block.title,
    entity: block.entity,
    workflowStageCount: block.summary.workflowStageCount
  };
}
