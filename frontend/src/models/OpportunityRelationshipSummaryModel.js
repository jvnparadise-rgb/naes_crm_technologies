export function createOpportunityRelationshipSummaryModel() {
  return {
    type: 'OpportunityRelationshipSummaryModel',
    summaryId: 'opportunityRelationshipSummary',
    slots: [
      {
        key: 'account',
        label: 'Account',
        required: true,
        cardinality: 'single'
      },
      {
        key: 'primaryContact',
        label: 'Primary Contact',
        required: true,
        cardinality: 'single'
      },
      {
        key: 'additionalContacts',
        label: 'Additional Contacts',
        required: false,
        cardinality: 'multiple'
      }
    ]
  };
}
