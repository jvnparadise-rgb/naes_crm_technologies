export const quoteDomainContract = {
  entity: 'quote',

  requiredRelationships: {
    opportunity: true,
    account: true,
    primaryContact: false
  },

  brandingProfiles: [
    'StratoSight',
    'Renewables',
    'Generic'
  ],

  coreFields: [
    'id',
    'opportunityId',
    'accountId',
    'primaryContactId',
    'quoteNumber',
    'brandingProfile',
    'letterheadType',
    'accentColor',
    'status',
    'version',
    'generatedAt',
    'generatedByUserId',
    'generatedByUserName',
    'createdAt',
    'updatedAt'
  ],

  retentionRequirements: {
    keepHistoricalQuotes: true,
    keepVersionHistory: true,
    timestampRequired: true,
    actingUserRequired: true
  },

  supportedOutputs: [
    'pdf'
  ],

  statusModel: [
    'Draft',
    'Generated',
    'Sent',
    'Revised',
    'Archived'
  ],

  auditIntegration: {
    required: true,
    auditEntityType: 'quote',
    trackedActions: [
      'create',
      'update',
      'quote_generated',
      'quote_updated',
      'quote_sent',
      'archive'
    ]
  }
};
