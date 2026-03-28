import { contactDomainContract } from '../../../src/domain/contactDomainContract.js';
import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';
import { contactEntryUiContract } from '../../../src/ui-contracts/contactEntryUiContract.js';

export function createContactsPageModel() {
  return {
    type: 'ContactsPageModel',

    header: {
      title: 'Contacts',
      entity: contactDomainContract.entity
    },

    coreFields: contactDomainContract.coreFields,
    relationshipFields: contactDomainContract.relationshipFields,
    opportunityHubRelationship: contactDomainContract.opportunityHubRelationship,

    relatedOpportunityContext: {
      linkedToOpportunityModel: true,
      serviceToggles: opportunityDomainContract.serviceToggles
    },

    contactEntry: {
      requiredActions: contactEntryUiContract.requiredActions,
      requiredFields: contactEntryUiContract.requiredFields,
      createFlow: contactEntryUiContract.createFlow
    }
  };
}
