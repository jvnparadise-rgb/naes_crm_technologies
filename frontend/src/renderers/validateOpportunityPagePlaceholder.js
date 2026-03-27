import { renderOpportunityPagePlaceholder } from './renderOpportunityPagePlaceholder.js';
import { validateOpportunityHeaderBlock } from './validateOpportunityHeaderBlock.js';
import { validateOpportunityRelationshipBlock } from './validateOpportunityRelationshipBlock.js';

export function validateOpportunityPagePlaceholder() {
  const view = renderOpportunityPagePlaceholder();
  const headerBlock = validateOpportunityHeaderBlock();
  const relationshipBlock = validateOpportunityRelationshipBlock();

  if (view.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder renderer did not initialize.');
  }

  if (!Array.isArray(view.sections) || view.sections.length === 0) {
    throw new Error('Opportunity placeholder sections are missing.');
  }

  if (!view.headerBlock || view.headerBlock.type !== 'OpportunityHeaderBlock') {
    throw new Error('Opportunity placeholder header block is missing.');
  }

  if (!view.relationshipBlock || view.relationshipBlock.type !== 'OpportunityRelationshipBlock') {
    throw new Error('Opportunity placeholder relationship block is missing.');
  }

  if (!view.headerSection || view.headerSection.sectionId !== 'opportunityHeader') {
    throw new Error('Opportunity placeholder header section contract is missing.');
  }

  if (!view.headerSummary || view.headerSummary.summaryId !== 'opportunityHeaderSummary') {
    throw new Error('Opportunity placeholder header summary contract is missing.');
  }

  if (!view.relationshipSection || view.relationshipSection.sectionId !== 'accountRelationship') {
    throw new Error('Opportunity placeholder relationship section contract is missing.');
  }

  if (!view.relationshipSummary || view.relationshipSummary.summaryId !== 'opportunityRelationshipSummary') {
    throw new Error('Opportunity placeholder relationship summary contract is missing.');
  }

  if (!view.serviceToggleSummary || view.serviceToggleSummary.summaryId !== 'opportunityServiceToggleSummary') {
    throw new Error('Opportunity placeholder service toggle summary contract is missing.');
  }

  if (!view.workflowSummary || view.workflowSummary.summaryId !== 'opportunityWorkflowSummary') {
    throw new Error('Opportunity placeholder workflow summary contract is missing.');
  }

  if (!view.quotesSummary || view.quotesSummary.summaryId !== 'opportunityQuotesSummary') {
    throw new Error('Opportunity placeholder quotes summary contract is missing.');
  }

  if (!view.auditSummary || view.auditSummary.summaryId !== 'opportunityAuditSummary') {
    throw new Error('Opportunity placeholder audit summary contract is missing.');
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
    headerBlockType: headerBlock.type,
    relationshipBlockType: relationshipBlock.type,
    headerSectionId: view.headerSection.sectionId,
    headerSummaryId: view.headerSummary.summaryId,
    relationshipSectionId: view.relationshipSection.sectionId,
    relationshipSummaryId: view.relationshipSummary.summaryId,
    serviceToggleSummaryId: view.serviceToggleSummary.summaryId,
    workflowSummaryId: view.workflowSummary.summaryId,
    quotesSummaryId: view.quotesSummary.summaryId,
    auditSummaryId: view.auditSummary.summaryId,
    sectionCount: view.sections.length,
    quoteActionCount: view.quotes.actionCount,
    auditRequired: view.audit.required
  };
}
