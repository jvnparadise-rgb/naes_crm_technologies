import { renderOpportunityPagePlaceholder } from './renderOpportunityPagePlaceholder.js';

export function validateOpportunityPagePlaceholder() {
  const view = renderOpportunityPagePlaceholder();

  if (view.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder renderer did not initialize.');
  }

  if (!view.header || view.header.type !== 'OpportunityHeaderBlock') {
    throw new Error('Opportunity header block was not loaded into placeholder renderer.');
  }

  if (!view.serviceToggle || view.serviceToggle.type !== 'OpportunityServiceToggleBlock') {
    throw new Error('Opportunity service toggle block was not loaded into placeholder renderer.');
  }

  if (!view.workflow || view.workflow.type !== 'OpportunityWorkflowBlock') {
    throw new Error('Opportunity workflow block was not loaded into placeholder renderer.');
  }

  if (!Array.isArray(view.sections) || view.sections.length === 0) {
    throw new Error('Opportunity placeholder sections are missing.');
  }

  if (!view.relationships.accountRequired) {
    throw new Error('Account relationship must remain required in placeholder renderer.');
  }

  if (!Array.isArray(view.relationships.relationshipBlocks) || view.relationships.relationshipBlocks.length !== 3) {
    throw new Error('Opportunity relationship blocks are incomplete in placeholder renderer.');
  }

  return {
    ok: true,
    pageTitle: view.pageTitle,
    headerTitle: view.header.title,
    serviceToggleOptionCount: view.serviceToggle.optionCount,
    workflowStageCount: view.workflow.stageCount,
    sectionCount: view.sections.length,
    relationshipBlockCount: view.relationships.relationshipBlocks.length,
    quoteActionCount: view.quotes.actionCount,
    auditRequired: view.audit.required
  };
}
