import { createOpportunityRelationshipSummaryModel } from './OpportunityRelationshipSummaryModel.js';

export function validateOpportunityRelationshipSummaryModel() {
  const model = createOpportunityRelationshipSummaryModel();

  if (model.type !== 'OpportunityRelationshipSummaryModel') {
    throw new Error('Opportunity relationship summary model did not initialize.');
  }

  if (model.summaryId !== 'opportunityRelationshipSummary') {
    throw new Error('Opportunity relationship summary id is invalid.');
  }

  if (!Array.isArray(model.slots) || model.slots.length !== 3) {
    throw new Error('Opportunity relationship summary slots are invalid.');
  }

  const requiredKeys = ['account', 'primaryContact', 'additionalContacts'];
  const actualKeys = model.slots.map((slot) => slot.key);

  for (const key of requiredKeys) {
    if (!actualKeys.includes(key)) {
      throw new Error(`Missing opportunity relationship summary slot: ${key}`);
    }
  }

  return {
    ok: true,
    summaryId: model.summaryId,
    slotCount: model.slots.length,
    requiredSlotCount: model.slots.filter((slot) => slot.required).length
  };
}
