import { createOpportunityHeaderSectionModel } from './OpportunityHeaderSectionModel.js';

export function validateOpportunityHeaderSectionModel() {
  const model = createOpportunityHeaderSectionModel();

  if (model.type !== 'OpportunityHeaderSectionModel') {
    throw new Error('Opportunity header section model did not initialize.');
  }

  if (model.sectionId !== 'opportunityHeader') {
    throw new Error('Opportunity header section id is invalid.');
  }

  if (!Array.isArray(model.summaryFields) || model.summaryFields.length === 0) {
    throw new Error('Opportunity header summary fields are missing.');
  }

  return {
    ok: true,
    sectionId: model.sectionId,
    summaryFieldCount: model.summaryFields.length,
    showsQuoteEntryPoint: model.showsQuoteEntryPoint
  };
}
