import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityHeaderBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityHeaderBlock',
    title: model.header.title,
    entity: model.header.entity,
    summary: {
      serviceToggleCount: model.serviceToggle.options.length,
      workflowStageCount: model.workflow.stages.length,
      quoteBrandingProfileCount: model.quotes.brandingProfiles.length
    }
  };
}
