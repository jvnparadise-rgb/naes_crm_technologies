import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityPagePlaceholder() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityPagePlaceholder',
    pageTitle: model.header.title,
    sections: model.requiredSections.map((sectionId) => ({
      id: sectionId,
      status: 'placeholder'
    })),
    relationships: {
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
    },
    serviceToggle: model.serviceToggle,
    workflow: {
      stageCount: model.workflow.stages.length,
      statusCount: model.workflow.statuses.length
    },
    quotes: {
      brandingProfiles: model.quotes.brandingProfiles,
      actionCount: model.quotes.requiredActions.length
    },
    audit: model.audit
  };
}
