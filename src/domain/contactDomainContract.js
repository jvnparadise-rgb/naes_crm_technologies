export const contactDomainContract = {
  entity: 'contact',

  coreFields: [
    'id',
    'accountId',
    'firstName',
    'lastName',
    'fullName',
    'email',
    'phone',
    'title',
    'status',
    'createdAt',
    'updatedAt'
  ],

  relationshipFields: [
    'accountId',
    'opportunityIds'
  ],

  opportunityHubRelationship: {
    canBePrimaryOpportunityContact: true,
    canBeAdditionalOpportunityContact: true,
    note: 'Contacts should support both primary and additional relationship roles within the Opportunity hub.'
  }
};
