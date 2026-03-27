export const opportunityDomainContract = {
  entity: 'opportunity',

  requiredRelationships: {
    account: true,
    primaryContact: false,
    additionalContacts: true
  },

  serviceToggles: ['Renewables', 'StratoSight', 'Both', 'Other O&M'],

  coreFields: [
    'id',
    'name',
    'accountId',
    'primaryContactId',
    'serviceToggle',
    'stage',
    'status',
    'ownerUserId',
    'createdAt',
    'updatedAt'
  ],

  commercialFields: [
    'mwdc',
    'mwac',
    'sqft',
    'pricingMode',
    'priceLow',
    'priceHigh',
    'priceTarget',
    'otherOMPricingMode',
    'otherOMPrice'
  ],

  quoteFields: [
    'quoteProfile',
    'quoteLetterhead',
    'quoteAccentColor',
    'quoteGeneratedAt',
    'quoteGeneratedByUserId'
  ],

  auditFields: [
    'createdAt',
    'createdByUserId',
    'updatedAt',
    'updatedByUserId'
  ],

  historyRequirements: {
    quoteRetention: true,
    pipelineChangeTracking: true,
    timestampRequired: true,
    actingUserRequired: true
  }
};
