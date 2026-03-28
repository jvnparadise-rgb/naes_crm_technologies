import { createAccountsPageModel } from '../models/AccountsPageModel.js';

export function renderAccountsPagePlaceholder() {
  const model = createAccountsPageModel();

  return {
    type: 'AccountsPagePlaceholder',
    pageTitle: model.header.title,
    sections: [
      { id: 'accountHeader', status: 'placeholder' },
      { id: 'accountCoreFields', status: 'placeholder' },
      { id: 'accountRelationships', status: 'placeholder' },
      { id: 'linkedOpportunities', status: 'placeholder' },
      { id: 'futureClientReports', status: 'placeholder' }
    ],
    coreFieldCount: model.coreFields.length,
    relationshipFieldCount: model.relationshipFields.length,
    linkedModuleCount: model.futureLinkedModules.length,
    linkedToOpportunityHub: model.opportunityHubRelationship.linkedToOpportunityModel
  };
}
