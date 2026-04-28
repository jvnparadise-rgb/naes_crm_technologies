import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';
import { renderOpportunityHeaderBlock } from './renderOpportunityHeaderBlock.js';
import { renderOpportunityRelationshipBlock } from './renderOpportunityRelationshipBlock.js';
import { renderOpportunityServiceToggleBlock } from './renderOpportunityServiceToggleBlock.js';
import { renderOpportunityWorkflowBlock } from './renderOpportunityWorkflowBlock.js';

export function renderOpportunityPagePlaceholder() {
  const model = createOpportunityPageModel();
  const headerBlock = renderOpportunityHeaderBlock();
  const relationshipBlock = renderOpportunityRelationshipBlock();
  const serviceToggleBlock = renderOpportunityServiceToggleBlock();
  const workflowBlock = renderOpportunityWorkflowBlock();

  return {
    type: 'OpportunityPagePlaceholder',
    pageTitle: model.header.title,
    header: headerBlock,
    sections: model.requiredSections.map((sectionId) => ({
      id: sectionId,
      status: 'placeholder'
    })),
    relationships: relationshipBlock,
    serviceToggle: serviceToggleBlock,
    workflow: workflowBlock,
    quotes: {
      brandingProfiles: model.quotes.brandingProfiles,
      actionCount: model.quotes.requiredActions.length
    },
    audit: model.audit
  };
}
