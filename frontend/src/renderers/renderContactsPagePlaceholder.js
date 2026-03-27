import { createContactsPageModel } from '../models/ContactsPageModel.js';

export function renderContactsPagePlaceholder() {
  const model = createContactsPageModel();

  return {
    type: 'ContactsPagePlaceholder',
    pageTitle: model.header.title,
    sections: [
      { id: 'contactHeader', status: 'placeholder' },
      { id: 'contactCoreFields', status: 'placeholder' },
      { id: 'contactRelationships', status: 'placeholder' },
      { id: 'linkedOpportunities', status: 'placeholder' }
    ],
    coreFieldCount: model.coreFields.length,
    relationshipFieldCount: model.relationshipFields.length,
    supportsPrimaryOpportunityContact: model.opportunityHubRelationship.canBePrimaryOpportunityContact,
    supportsAdditionalOpportunityContacts: model.opportunityHubRelationship.canBeAdditionalOpportunityContact
  };
}
