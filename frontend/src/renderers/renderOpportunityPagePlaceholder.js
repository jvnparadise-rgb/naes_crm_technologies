import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityPagePlaceholder() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityPagePlaceholder',
    pageTitle: model.header.title,
    sections: model.requiredSections.map((sectionId) => ({
      id: sectionId,
      status: 'placeholder'
    })),
    headerSection: model.headerSection,
    headerSummary: model.headerSummary,
    relationshipSection: model.relationshipSection,
    relationshipSummary: model.relationshipSummary,
    relationships: model.relationships,
    serviceToggle: model.serviceToggle,
    serviceToggleSummary: model.serviceToggleSummary,
    workflow: {
      stageCount: model.workflow.stages.length,
      statusCount: model.workflow.statuses.length
    },
    workflowSummary: model.workflowSummary,
    quotes: {
      brandingProfiles: model.quotes.brandingProfiles,
      actionCount: model.quotes.requiredActions.length
    },
    quotesSummary: model.quotesSummary,
    audit: model.audit,
    auditSummary: model.auditSummary
  };
}
