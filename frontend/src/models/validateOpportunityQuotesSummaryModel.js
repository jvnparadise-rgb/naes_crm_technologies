import { createOpportunityQuotesSummaryModel } from './OpportunityQuotesSummaryModel.js';

export function validateOpportunityQuotesSummaryModel() {
  const model = createOpportunityQuotesSummaryModel();

  if (model.type !== 'OpportunityQuotesSummaryModel') {
    throw new Error('Opportunity quotes summary model did not initialize.');
  }

  if (model.summaryId !== 'opportunityQuotesSummary') {
    throw new Error('Opportunity quotes summary id is invalid.');
  }

  if (!Array.isArray(model.metrics) || model.metrics.length !== 3) {
    throw new Error('Opportunity quotes summary metrics are invalid.');
  }

  const requiredKeys = ['brandingProfiles', 'requiredActions', 'retentionRequirements'];
  const actualKeys = model.metrics.map((metric) => metric.key);

  for (const key of requiredKeys) {
    if (!actualKeys.includes(key)) {
      throw new Error(`Missing opportunity quotes summary metric: ${key}`);
    }
  }

  return {
    ok: true,
    summaryId: model.summaryId,
    metricCount: model.metrics.length,
    requiredMetricCount: model.metrics.filter((metric) => metric.required).length
  };
}
