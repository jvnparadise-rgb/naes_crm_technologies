import { contactDomainContract } from '../../../src/domain/contactDomainContract.js';
import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';

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
    }
  };
}
