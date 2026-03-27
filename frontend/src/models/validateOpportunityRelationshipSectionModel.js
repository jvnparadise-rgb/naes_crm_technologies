import { createOpportunityRelationshipSectionModel } from './OpportunityRelationshipSectionModel.js';

export function validateOpportunityRelationshipSectionModel() {
  const model = createOpportunityRelationshipSectionModel();

  if (model.type !== 'OpportunityRelationshipSectionModel') {
    throw new Error('Opportunity relationship section model did not initialize.');
  }

  if (model.sectionId !== 'accountRelationship') {
    throw new Error('Opportunity relationship section id is invalid.');
  }

  if (!model.accountRequired) {
    throw new Error('Account relationship must remain required.');
  }

  if (!Array.isArray(model.relationshipSlots) || model.relationshipSlots.length !== 3) {
    throw new Error('Opportunity relationship slots are invalid.');
  }

  return {
    ok: true,
    sectionId: model.sectionId,
    accountRequired: model.accountRequired,
    primaryContactOptional: model.primaryContactOptional,
    additionalContactsSupported: model.additionalContactsSupported
  };
}
