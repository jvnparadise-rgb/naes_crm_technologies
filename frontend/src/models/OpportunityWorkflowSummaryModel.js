export function createOpportunityWorkflowSummaryModel() {
  return {
    type: 'OpportunityWorkflowSummaryModel',
    summaryId: 'opportunityWorkflowSummary',
    metrics: [
      {
        key: 'stages',
        label: 'Stages',
        required: true
      },
      {
        key: 'statuses',
        label: 'Statuses',
        required: true
      },
      {
        key: 'rules',
        label: 'Rules',
        required: true
      }
    ]
  };
}
