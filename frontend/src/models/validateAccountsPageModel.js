import { createAccountsPageModel } from './AccountsPageModel.js';

export function validateAccountsPageModel() {
  const model = createAccountsPageModel();

  if (model.type !== 'AccountsPageModel') {
    throw new Error('Accounts page model did not initialize.');
  }

  if (!model.opportunityHubRelationship.linkedToOpportunityModel) {
    throw new Error('Accounts page must remain linked to the Opportunity hub.');
  }

  if (!Array.isArray(model.coreFields) || model.coreFields.length === 0) {
    throw new Error('Accounts core fields are missing.');
  }

  if (!Array.isArray(model.relatedOpportunityContext.serviceToggles) || model.relatedOpportunityContext.serviceToggles.length !== 4) {
    throw new Error('Related opportunity context is invalid.');
  }

  return {
    ok: true,
    coreFieldCount: model.coreFields.length,
    relationshipFieldCount: model.relationshipFields.length,
    linkedModuleCount: model.futureLinkedModules.length
  };
}
