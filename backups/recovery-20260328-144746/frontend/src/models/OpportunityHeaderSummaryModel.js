export function createOpportunityHeaderSummaryModel() {
  return {
    type: 'OpportunityHeaderSummaryModel',
    summaryId: 'opportunityHeaderSummary',
    fields: [
      {
        key: 'name',
        label: 'Opportunity Name',
        required: true
      },
      {
        key: 'serviceLine',
        label: 'Service Line',
        required: true
      },
      {
        key: 'stage',
        label: 'Stage',
        required: true
      },
      {
        key: 'owner',
        label: 'Owner',
        required: true
      },
      {
        key: 'expectedCloseDate',
        label: 'Expected Close Date',
        required: false
      }
    ]
  };
}
