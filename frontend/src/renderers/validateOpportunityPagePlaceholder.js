import { renderOpportunityPagePlaceholder } from './renderOpportunityPagePlaceholder.js';

export function validateOpportunityPagePlaceholder() {
  const view = renderOpportunityPagePlaceholder();

  if (view.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder renderer did not initialize.');
  }

  if (!Array.isArray(view.sections) || view.sections.length === 0) {
    throw new Error('Opportunity placeholder sections are missing.');
  }

  if (!view.relationships.accountRequired) {
    throw new Error('Account relationship must remain required in placeholder renderer.');
  }

  if (!view.relationships.inlineAccountCreateSupported) {
    throw new Error('Inline account creation must be supported in the opportunity placeholder.');
  }

  if (!view.relationships.inlineContactCreateSupported) {
    throw new Error('Inline contact creation must be supported in the opportunity placeholder.');
  }

  if (!Array.isArray(view.relationships.relationshipBlocks) || view.relationships.relationshipBlocks.length !== 3) {
    throw new Error('Opportunity relationship blocks are incomplete.');
  }

  if (view.workflow.stageCount < 1 || view.workflow.statusCount < 1) {
    throw new Error('Workflow summary is invalid.');
  }

  return {
    ok: true,
    pageTitle: view.pageTitle,
    sectionCount: view.sections.length,
    relationshipBlockCount: view.relationships.relationshipBlocks.length,
    quoteActionCount: view.quotes.actionCount,
    auditRequired: view.audit.required
  };
}
