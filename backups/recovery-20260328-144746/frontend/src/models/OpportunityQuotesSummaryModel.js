export function createOpportunityQuotesSummaryModel() {
  return {
    type: 'OpportunityQuotesSummaryModel',
    summaryId: 'opportunityQuotesSummary',
    metrics: [
      {
        key: 'brandingProfiles',
        label: 'Branding Profiles',
        required: true
      },
      {
        key: 'requiredActions',
        label: 'Required Actions',
        required: true
      },
      {
        key: 'retentionRequirements',
        label: 'Retention Requirements',
        required: true
      }
    ]
  };
}
