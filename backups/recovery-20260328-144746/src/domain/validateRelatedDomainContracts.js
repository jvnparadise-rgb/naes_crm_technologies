import { accountDomainContract } from './accountDomainContract.js';
import { contactDomainContract } from './contactDomainContract.js';

export function validateRelatedDomainContracts() {
  if (!accountDomainContract.opportunityHubRelationship?.linkedToOpportunityModel) {
    throw new Error('Account contract must be linked to the Opportunity hub.');
  }

  if (!contactDomainContract.opportunityHubRelationship?.canBePrimaryOpportunityContact) {
    throw new Error('Contact contract must support primary opportunity contact.');
  }

  if (!contactDomainContract.opportunityHubRelationship?.canBeAdditionalOpportunityContact) {
    throw new Error('Contact contract must support additional opportunity contacts.');
  }

  return {
    ok: true,
    accountCoreFieldCount: accountDomainContract.coreFields.length,
    contactCoreFieldCount: contactDomainContract.coreFields.length
  };
}
