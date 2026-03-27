export const opportunityWorkflowContract = {
  entity: 'opportunity-workflow',

  stages: [
    'Prospecting',
    'Qualified',
    'Discovery',
    'Proposal',
    'Quoted',
    'Negotiation',
    'Verbal Commit',
    'Closed Won',
    'Closed Lost'
  ],

  statuses: [
    'Open',
    'On Hold',
    'Quoted',
    'Negotiating',
    'Won',
    'Lost'
  ],

  quoteRelatedStages: [
    'Proposal',
    'Quoted',
    'Negotiation',
    'Verbal Commit'
  ],

  closedStages: [
    'Closed Won',
    'Closed Lost'
  ],

  rules: {
    quoteGenerationAllowedFromStages: ['Proposal', 'Quoted', 'Negotiation', 'Verbal Commit'],
    closedWonRequiresStatus: 'Won',
    closedLostRequiresStatus: 'Lost',
    openStagesMustNotUseClosedStatuses: true
  }
};
