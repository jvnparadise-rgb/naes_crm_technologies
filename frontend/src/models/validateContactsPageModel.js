import { createContactsPageModel } from './ContactsPageModel.js';

export function validateContactsPageModel() {
  const model = createContactsPageModel();

  if (model.type !== 'ContactsPageModel') {
    throw new Error('Contacts page model did not initialize.');
  }

  if (!model.opportunityHubRelationship.canBePrimaryOpportunityContact) {
    throw new Error('Contacts page must support primary opportunity contact.');
  }

  if (!model.opportunityHubRelationship.canBeAdditionalOpportunityContact) {
    throw new Error('Contacts page must support additional opportunity contacts.');
  }

  if (!Array.isArray(model.coreFields) || model.coreFields.length === 0) {
    throw new Error('Contacts core fields are missing.');
  }

  if (!Array.isArray(model.relatedOpportunityContext.serviceToggles) || model.relatedOpportunityContext.serviceToggles.length !== 4) {
    throw new Error('Related opportunity context is invalid.');
  }

  return {
    ok: true,
    coreFieldCount: model.coreFields.length,
    relationshipFieldCount: model.relationshipFields.length,
    supportsPrimaryOpportunityContact: model.opportunityHubRelationship.canBePrimaryOpportunityContact
  };
}
