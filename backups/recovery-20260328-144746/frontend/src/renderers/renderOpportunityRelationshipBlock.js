import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityRelationshipBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityRelationshipBlock',
    accountRequired: model.relationships.accountRequired,
    primaryContactOptional: model.relationships.primaryContactOptional,
    additionalContactsSupported: model.relationships.additionalContactsSupported,
    accountLinkActions: model.relationships.accountLinkActions,
    inlineAccountCreateSupported: model.relationships.inlineAccountCreateSupported,
    contactLinkActions: model.relationships.contactLinkActions,
    inlineContactCreateSupported: model.relationships.inlineContactCreateSupported,
    relationshipBlocks: [
      {
        id: 'account-relationship',
        label: 'Account Relationship',
        actions: model.relationships.accountLinkActions,
        inlineCreateSupported: model.relationships.inlineAccountCreateSupported
      },
      {
        id: 'primary-contact-relationship',
        label: 'Primary Contact Relationship',
        actions: model.relationships.contactLinkActions.filter(action =>
          ['selectPrimaryContact', 'createPrimaryContact', 'bindContactToOpportunity'].includes(action)
        ),
        inlineCreateSupported: model.relationships.inlineContactCreateSupported
      },
      {
        id: 'additional-contacts-relationship',
        label: 'Additional Contacts Relationship',
        actions: model.relationships.contactLinkActions.filter(action =>
          ['addAdditionalContact', 'createAdditionalContact', 'bindContactToOpportunity'].includes(action)
        ),
        inlineCreateSupported: model.relationships.inlineContactCreateSupported
      }
    ]
  };
}
