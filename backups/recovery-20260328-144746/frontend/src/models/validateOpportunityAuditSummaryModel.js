import { createOpportunityAuditSummaryModel } from './OpportunityAuditSummaryModel.js';

export function validateOpportunityAuditSummaryModel() {
  const model = createOpportunityAuditSummaryModel();

  if (model.type !== 'OpportunityAuditSummaryModel') {
    throw new Error('Opportunity audit summary model did not initialize.');
  }

  if (model.summaryId !== 'opportunityAuditSummary') {
    throw new Error('Opportunity audit summary id is invalid.');
  }

  if (!Array.isArray(model.metrics) || model.metrics.length !== 2) {
    throw new Error('Opportunity audit summary metrics are invalid.');
  }

  const requiredKeys = ['required', 'trackedEntityTypes'];
  const actualKeys = model.metrics.map((metric) => metric.key);

  for (const key of requiredKeys) {
    if (!actualKeys.includes(key)) {
      throw new Error(`Missing opportunity audit summary metric: ${key}`);
    }
  }

  return {
    ok: true,
    summaryId: model.summaryId,
    metricCount: model.metrics.length,
    requiredMetricCount: model.metrics.filter((metric) => metric.required).length
  };
}
