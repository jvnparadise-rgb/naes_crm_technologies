import { accountDomainContract } from '../../../src/domain/accountDomainContract.js';
import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';

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
    }
  };
}
