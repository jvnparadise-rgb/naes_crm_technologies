import { createOpportunityServiceToggleSummaryModel } from './OpportunityServiceToggleSummaryModel.js';

export function validateOpportunityServiceToggleSummaryModel() {
  const model = createOpportunityServiceToggleSummaryModel();

  if (model.type !== 'OpportunityServiceToggleSummaryModel') {
    throw new Error('Opportunity service toggle summary model did not initialize.');
  }

  if (model.summaryId !== 'opportunityServiceToggleSummary') {
    throw new Error('Opportunity service toggle summary id is invalid.');
  }

  if (!Array.isArray(model.options) || model.options.length !== 4) {
    throw new Error('Opportunity service toggle summary options are invalid.');
  }

  const requiredKeys = ['renewables', 'stratosight', 'both', 'otherOM'];
  const actualKeys = model.options.map((option) => option.key);

  for (const key of requiredKeys) {
    if (!actualKeys.includes(key)) {
      throw new Error(`Missing opportunity service toggle option: ${key}`);
    }
  }

  return {
    ok: true,
    summaryId: model.summaryId,
    optionCount: model.options.length,
    requiredOptionCount: model.options.filter((option) => option.required).length
  };
}
