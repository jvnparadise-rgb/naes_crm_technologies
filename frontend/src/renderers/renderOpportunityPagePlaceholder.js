import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';
import { renderOpportunityHeaderBlock } from './renderOpportunityHeaderBlock.js';
import { renderOpportunityRelationshipBlock } from './renderOpportunityRelationshipBlock.js';

export function renderOpportunityPagePlaceholder() {
  const model = createOpportunityPageModel();
  const headerBlock = renderOpportunityHeaderBlock();
  const relationshipBlock = renderOpportunityRelationshipBlock();

  return {
    type: 'OpportunityPagePlaceholder',
    pageTitle: model.header.title,
    header: headerBlock,
    sections: model.requiredSections.map((sectionId) => ({
      id: sectionId,
      status: 'placeholder'
    })),
    relationships: relationshipBlock,
    serviceToggle: model.serviceToggle,
    workflow: {
      stageCount: model.workflow.stages.length,
      statusCount: model.workflow.statuses.length
    },
    quotes: {
      brandingProfiles: model.quotes.brandingProfiles,
      actionCount: model.quotes.requiredActions.length
    },
    audit: model.audit
  };
}
