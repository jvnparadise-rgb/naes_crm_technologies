export function createOpportunityAuditSummaryModel() {
  return {
    type: 'OpportunityAuditSummaryModel',
    summaryId: 'opportunityAuditSummary',
    metrics: [
      {
        key: 'required',
        label: 'Audit Required',
        required: true
      },
      {
        key: 'trackedEntityTypes',
        label: 'Tracked Entity Types',
        required: true
      }
    ]
  };
}
