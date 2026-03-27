import { renderOpportunityWorkflowBlock } from './renderOpportunityWorkflowBlock.js';

export function validateOpportunityWorkflowBlock() {
  const view = renderOpportunityWorkflowBlock();

  if (view.type !== 'OpportunityWorkflowBlock') {
    throw new Error('Opportunity workflow block did not initialize.');
  }

  if (view.sectionId !== 'opportunityWorkflow') {
    throw new Error('Opportunity workflow block section id is invalid.');
  }

  if (view.summaryId !== 'opportunityWorkflowSummary') {
    throw new Error('Opportunity workflow block summary id is invalid.');
  }

  if (!Array.isArray(view.metrics) || view.metrics.length !== 3) {
    throw new Error('Opportunity workflow block metrics are invalid.');
  }

  const metricKeys = view.metrics.map((metric) => metric?.key);
  for (const requiredKey of ['stages', 'statuses', 'rules']) {
    if (!metricKeys.includes(requiredKey)) {
      throw new Error(`Missing opportunity workflow metric: ${requiredKey}`);
    }
  }

  if (!Array.isArray(view.workflow?.stages) || view.workflow.stages.length < 5) {
    throw new Error('Opportunity workflow stages are invalid.');
  }

  if (!Array.isArray(view.workflow?.statuses) || view.workflow.statuses.length < 3) {
    throw new Error('Opportunity workflow statuses are invalid.');
  }

  if (!view.workflow?.rules || typeof view.workflow.rules !== 'object') {
    throw new Error('Opportunity workflow rules are invalid.');
  }

  if (!Array.isArray(view.workflow.rules.quoteGenerationAllowedFromStages)) {
    throw new Error('Opportunity workflow quote-generation rules are invalid.');
  }

  return {
    ok: true,
    type: view.type,
    title: view.title,
    sectionId: view.sectionId,
    summaryId: view.summaryId,
    metricCount: view.metrics.length,
    stageCount: view.workflow.stages.length,
    statusCount: view.workflow.statuses.length
  };
}
