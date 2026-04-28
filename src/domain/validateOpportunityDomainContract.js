import { opportunityDomainContract } from './opportunityDomainContract.js';

export function validateOpportunityDomainContract() {
  const requiredToggles = ['Renewables', 'StratoSight', 'Both', 'Other O&M'];

  for (const toggle of requiredToggles) {
    if (!opportunityDomainContract.serviceToggles.includes(toggle)) {
      throw new Error(`Missing opportunity service toggle: ${toggle}`);
    }
  }

  const requiredCoreFields = ['id', 'name', 'accountId', 'serviceToggle', 'stage', 'status'];
  for (const field of requiredCoreFields) {
    if (!opportunityDomainContract.coreFields.includes(field)) {
      throw new Error(`Missing required core field: ${field}`);
    }
  }

  if (!opportunityDomainContract.historyRequirements.quoteRetention) {
    throw new Error('Quote retention must be enabled.');
  }

  if (!opportunityDomainContract.historyRequirements.timestampRequired) {
    throw new Error('Timestamp tracking must be enabled.');
  }

  if (!opportunityDomainContract.historyRequirements.actingUserRequired) {
    throw new Error('Acting user tracking must be enabled.');
  }

  return {
    ok: true,
    coreFieldCount: opportunityDomainContract.coreFields.length,
    commercialFieldCount: opportunityDomainContract.commercialFields.length,
    quoteFieldCount: opportunityDomainContract.quoteFields.length
  };
}
