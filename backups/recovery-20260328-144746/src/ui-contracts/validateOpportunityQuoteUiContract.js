import { opportunityQuoteUiContract } from './opportunityQuoteUiContract.js';

export function validateOpportunityQuoteUiContract() {
  const requiredSections = [
    'opportunityHeader',
    'pricingCardArea',
    'quoteGenerationPanel',
    'quoteHistoryPanel',
    'auditHistoryPanel'
  ];

  for (const section of requiredSections) {
    if (!opportunityQuoteUiContract.requiredSections.includes(section)) {
      throw new Error(`Missing required UI section: ${section}`);
    }
  }

  const requiredProfiles = ['StratoSight', 'Renewables', 'Generic'];
  for (const profile of requiredProfiles) {
    if (!opportunityQuoteUiContract.quotePanel.brandingProfiles.includes(profile)) {
      throw new Error(`Missing UI branding profile: ${profile}`);
    }
  }

  if (!opportunityQuoteUiContract.auditPanel.required) {
    throw new Error('Audit panel must be required.');
  }

  return {
    ok: true,
    sectionCount: opportunityQuoteUiContract.requiredSections.length,
    quoteActionCount: opportunityQuoteUiContract.quotePanel.requiredActions.length,
    trackedEntityCount: opportunityQuoteUiContract.auditPanel.trackedEntityTypes.length
  };
}
