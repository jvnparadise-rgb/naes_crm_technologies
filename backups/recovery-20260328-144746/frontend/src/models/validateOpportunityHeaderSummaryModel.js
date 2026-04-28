import { createOpportunityHeaderSummaryModel } from './OpportunityHeaderSummaryModel.js';

export function validateOpportunityHeaderSummaryModel() {
  const model = createOpportunityHeaderSummaryModel();

  if (model.type !== 'OpportunityHeaderSummaryModel') {
    throw new Error('Opportunity header summary model did not initialize.');
  }

  if (model.summaryId !== 'opportunityHeaderSummary') {
    throw new Error('Opportunity header summary id is invalid.');
  }

  if (!Array.isArray(model.fields) || model.fields.length !== 5) {
    throw new Error('Opportunity header summary fields are invalid.');
  }

  const requiredKeys = ['name', 'serviceLine', 'stage', 'owner', 'expectedCloseDate'];
  const actualKeys = model.fields.map((field) => field.key);

  for (const key of requiredKeys) {
    if (!actualKeys.includes(key)) {
      throw new Error(`Missing opportunity header summary field: ${key}`);
    }
  }

  return {
    ok: true,
    summaryId: model.summaryId,
    fieldCount: model.fields.length,
    requiredFieldCount: model.fields.filter((field) => field.required).length
  };
}
