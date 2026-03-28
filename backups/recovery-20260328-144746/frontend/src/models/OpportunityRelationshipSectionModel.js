import { opportunityDomainContract } from '../../../src/domain/opportunityDomainContract.js';

export function createOpportunityRelationshipSectionModel() {
  return {
    type: 'OpportunityRelationshipSectionModel',
    sectionId: 'accountRelationship',
    accountRequired: opportunityDomainContract.requiredRelationships.account,
    primaryContactOptional: opportunityDomainContract.requiredRelationships.primaryContact,
    additionalContactsSupported: opportunityDomainContract.requiredRelationships.additionalContacts,
    relationshipSlots: [
      'account',
      'primaryContact',
      'additionalContacts'
    ]
  };
}
