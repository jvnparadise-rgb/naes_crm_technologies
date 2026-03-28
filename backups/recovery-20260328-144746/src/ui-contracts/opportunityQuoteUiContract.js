export const opportunityQuoteUiContract = {
  page: 'opportunities',

  requiredSections: [
    'opportunityHeader',
    'accountRelationship',
    'contactRelationship',
    'serviceToggle',
    'pricingCardArea',
    'workflowStageStatus',
    'quoteGenerationPanel',
    'quoteHistoryPanel',
    'auditHistoryPanel'
  ],

  pricingArea: {
    supportedToggles: ['Renewables', 'StratoSight', 'Both', 'Other O&M'],
    registryDriven: true
  },

  quotePanel: {
    requiredActions: [
      'generateQuote',
      'viewQuoteHistory',
      'viewQuoteVersion',
      'viewQuoteBrandProfile'
    ],
    brandingProfiles: ['StratoSight', 'Renewables', 'Generic']
  },

  auditPanel: {
    required: true,
    trackedEntityTypes: ['opportunity', 'quote', 'pipeline']
  },

  relationshipAreas: {
    accountRequired: true,
    primaryContactOptional: true,
    additionalContactsSupported: true
  }
};
