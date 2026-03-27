export function createOpportunityServiceToggleSummaryModel() {
  return {
    type: 'OpportunityServiceToggleSummaryModel',
    summaryId: 'opportunityServiceToggleSummary',
    options: [
      {
        key: 'renewables',
        label: 'Renewables',
        required: true
      },
      {
        key: 'stratosight',
        label: 'StratoSight',
        required: true
      },
      {
        key: 'both',
        label: 'Both',
        required: true
      },
      {
        key: 'otherOM',
        label: 'Other O&M',
        required: true
      }
    ]
  };
}
