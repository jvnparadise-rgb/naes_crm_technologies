import { accountDomainContract } from '../../../src/domain/accountDomainContract.js';
import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';
import { accountEntryUiContract } from '../../../src/ui-contracts/accountEntryUiContract.js';

export function createAccountsPageModel() {
  return {
    type: 'AccountsPageModel',

    header: {
      title: 'Accounts',
      entity: accountDomainContract.entity
    },

    coreFields: accountDomainContract.coreFields,
    relationshipFields: accountDomainContract.relationshipFields,
    futureLinkedModules: accountDomainContract.futureLinkedModules,

    opportunityHubRelationship: accountDomainContract.opportunityHubRelationship,

    relatedOpportunityContext: {
      linkedToOpportunityModel: true,
      serviceToggles: opportunityDomainContract.serviceToggles
    },

    accountEntry: {
      requiredActions: accountEntryUiContract.requiredActions,
      requiredFields: accountEntryUiContract.requiredFields,
      createFlow: accountEntryUiContract.createFlow
    }
  };
}
