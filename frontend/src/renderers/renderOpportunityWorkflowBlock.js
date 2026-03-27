import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityWorkflowBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityWorkflowBlock',
    title: 'Workflow',
    sectionId: 'opportunityWorkflow',
    summaryId: model.workflowSummary.summaryId,
    metrics: model.workflowSummary.metrics,
    workflow: {
      stages: model.workflow.stages,
      statuses: model.workflow.statuses,
      rules: model.workflow.rules
    }
  };
}
