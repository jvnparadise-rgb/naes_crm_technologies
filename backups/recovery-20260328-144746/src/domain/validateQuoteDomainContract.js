import { quoteDomainContract } from './quoteDomainContract.js';

export function validateQuoteDomainContract() {
  const requiredProfiles = ['StratoSight', 'Renewables', 'Generic'];
  for (const profile of requiredProfiles) {
    if (!quoteDomainContract.brandingProfiles.includes(profile)) {
      throw new Error(`Missing quote branding profile: ${profile}`);
    }
  }

  const requiredFields = [
    'id',
    'opportunityId',
    'accountId',
    'quoteNumber',
    'brandingProfile',
    'generatedAt',
    'generatedByUserId'
  ];

  for (const field of requiredFields) {
    if (!quoteDomainContract.coreFields.includes(field)) {
      throw new Error(`Missing required quote field: ${field}`);
    }
  }

  if (!quoteDomainContract.retentionRequirements.keepHistoricalQuotes) {
    throw new Error('Historical quote retention must be enabled.');
  }

  if (!quoteDomainContract.retentionRequirements.keepVersionHistory) {
    throw new Error('Quote version history must be enabled.');
  }

  if (!quoteDomainContract.auditIntegration.required) {
    throw new Error('Quote audit integration must be required.');
  }

  return {
    ok: true,
    brandingProfileCount: quoteDomainContract.brandingProfiles.length,
    coreFieldCount: quoteDomainContract.coreFields.length,
    statusCount: quoteDomainContract.statusModel.length
  };
}
