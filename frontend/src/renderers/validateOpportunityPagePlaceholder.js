import { renderOpportunityPagePlaceholder } from './renderOpportunityPagePlaceholder.js';

export function validateOpportunityPagePlaceholder() {
  const view = renderOpportunityPagePlaceholder();

  if (view.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder renderer did not initialize.');
  }

  if (!Array.isArray(view.sections) || view.sections.length === 0) {
    throw new Error('Opportunity placeholder sections are missing.');
  }

  if (!view.headerSection || view.headerSection.sectionId !== 'opportunityHeader') {
    throw new Error('Opportunity placeholder header section contract is missing.');
  }

  if (!view.relationshipSection || view.relationshipSection.sectionId !== 'accountRelationship') {
    throw new Error('Opportunity placeholder relationship section contract is missing.');
  }

  if (!view.relationships.accountRequired) {
    throw new Error('Account relationship must remain required in placeholder renderer.');
  }

  if (view.workflow.stageCount < 1 || view.workflow.statusCount < 1) {
    throw new Error('Workflow summary is invalid.');
  }

  return {
    ok: true,
    pageTitle: view.pageTitle,
    headerSectionId: view.headerSection.sectionId,
    relationshipSectionId: view.relationshipSection.sectionId,
    sectionCount: view.sections.length,
    quoteActionCount: view.quotes.actionCount,
    auditRequired: view.audit.required
  };
}
