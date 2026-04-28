import { createOpportunityWorkflowSummaryModel } from './OpportunityWorkflowSummaryModel.js';

export function validateOpportunityWorkflowSummaryModel() {
  const model = createOpportunityWorkflowSummaryModel();

  if (model.type !== 'OpportunityWorkflowSummaryModel') {
    throw new Error('Opportunity workflow summary model did not initialize.');
  }

  if (model.summaryId !== 'opportunityWorkflowSummary') {
    throw new Error('Opportunity workflow summary id is invalid.');
  }

  if (!Array.isArray(model.metrics) || model.metrics.length !== 3) {
    throw new Error('Opportunity workflow summary metrics are invalid.');
  }

  const requiredKeys = ['stages', 'statuses', 'rules'];
  const actualKeys = model.metrics.map((metric) => metric.key);

  for (const key of requiredKeys) {
    if (!actualKeys.includes(key)) {
      throw new Error(`Missing opportunity workflow summary metric: ${key}`);
    }
  }

  return {
    ok: true,
    summaryId: model.summaryId,
    metricCount: model.metrics.length,
    requiredMetricCount: model.metrics.filter((metric) => metric.required).length
  };
}
