import { renderOpportunityWorkflowBlock } from './renderOpportunityWorkflowBlock.js';

export function validateOpportunityWorkflowBlock() {
  const block = renderOpportunityWorkflowBlock();

  if (block.type !== 'OpportunityWorkflowBlock') {
    throw new Error('Opportunity workflow block did not initialize.');
  }

  if (!Array.isArray(block.stages) || block.stages.length === 0) {
    throw new Error('Opportunity workflow stages are missing.');
  }

  if (!Array.isArray(block.statuses) || block.statuses.length === 0) {
    throw new Error('Opportunity workflow statuses are missing.');
  }

  if (!block.rules || typeof block.rules !== 'object') {
    throw new Error('Opportunity workflow rules are missing.');
  }

  return {
    ok: true,
    stageCount: block.stageCount,
    statusCount: block.statusCount
  };
}
