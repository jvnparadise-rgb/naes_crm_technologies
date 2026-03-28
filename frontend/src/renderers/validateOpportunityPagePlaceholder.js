import { renderOpportunityPagePlaceholder } from './renderOpportunityPagePlaceholder.js';

export function validateOpportunityPagePlaceholder() {
  const view = renderOpportunityPagePlaceholder();

  if (view.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder renderer did not initialize.');
  }

  if (!view.header || view.header.type !== 'OpportunityHeaderBlock') {
    throw new Error('Opportunity header block was not loaded into placeholder renderer.');
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

  if (view.workflow.stageCount < 1 || view.workflow.statusCount < 1) {
    throw new Error('Workflow summary is invalid.');
  }

  return {
    ok: true,
    pageTitle: view.pageTitle,
    headerTitle: view.header.title,
    sectionCount: view.sections.length,
    relationshipBlockCount: view.relationships.relationshipBlocks.length,
    quoteActionCount: view.quotes.actionCount,
    auditRequired: view.audit.required
  };
}
