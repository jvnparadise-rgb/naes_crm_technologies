import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityRelationshipBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityRelationshipBlock',
    title: 'Relationships',
    sectionId: model.relationshipSection.sectionId,
    summaryId: model.relationshipSummary.summaryId,
    slots: model.relationshipSummary.slots,
    requirements: {
      accountRequired: model.relationships.accountRequired,
      primaryContactOptional: model.relationships.primaryContactOptional,
      additionalContactsSupported: model.relationships.additionalContactsSupported
    },
    actions: [
      {
        key: 'linkAccount',
        label: 'Link Account',
        status: model.relationships.accountRequired ? 'required' : 'enabled'
      },
      {
        key: 'linkPrimaryContact',
        label: 'Link Primary Contact',
        status: model.relationships.primaryContactOptional ? 'enabled' : 'required'
      },
      {
        key: 'addAdditionalContacts',
        label: 'Add Additional Contacts',
        status: model.relationships.additionalContactsSupported ? 'enabled' : 'hidden'
      }
    ]
  };
}
