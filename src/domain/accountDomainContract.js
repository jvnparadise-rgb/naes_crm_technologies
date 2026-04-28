export const accountDomainContract = {
  entity: 'account',

  coreFields: [
    'id',
    'name',
    'accountNumber',
    'industry',
    'status',
    'ownerUserId',
    'createdAt',
    'updatedAt'
  ],

  relationshipFields: [
    'primaryContactId',
    'contactIds',
    'opportunityIds'
  ],

  futureLinkedModules: [
    'clientReports',
    'accountHistory'
  ],

  opportunityHubRelationship: {
    linkedToOpportunityModel: true,
    note: 'Accounts are a core dependency of the Opportunity hub and should not be treated as an isolated module.'
  }
};
