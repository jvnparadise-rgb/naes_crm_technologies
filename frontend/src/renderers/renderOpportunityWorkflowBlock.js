import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityWorkflowBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityWorkflowBlock',
    stages: model.workflow.stages,
    statuses: model.workflow.statuses,
    rules: model.workflow.rules,
    stageCount: model.workflow.stages.length,
    statusCount: model.workflow.statuses.length
  };
}
