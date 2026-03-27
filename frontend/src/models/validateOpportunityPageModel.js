import { createOpportunityPageModel } from './OpportunityPageModel.js';
import { validateOpportunityHeaderSectionModel } from './validateOpportunityHeaderSectionModel.js';
import { validateOpportunityHeaderSummaryModel } from './validateOpportunityHeaderSummaryModel.js';
import { validateOpportunityRelationshipSectionModel } from './validateOpportunityRelationshipSectionModel.js';

export function validateOpportunityPageModel() {
  const model = createOpportunityPageModel();
  const headerSection = validateOpportunityHeaderSectionModel();
  const headerSummary = validateOpportunityHeaderSummaryModel();
  const relationshipSection = validateOpportunityRelationshipSectionModel();

  if (model.type !== 'OpportunityPageModel') {
    throw new Error('Opportunity page model did not initialize.');
  }

  if (!model.headerSection || model.headerSection.sectionId !== 'opportunityHeader') {
    throw new Error('Opportunity header section contract is missing.');
  }

  if (!model.headerSummary || model.headerSummary.summaryId !== 'opportunityHeaderSummary') {
    throw new Error('Opportunity header summary contract is missing.');
  }

  if (!model.relationshipSection || model.relationshipSection.sectionId !== 'accountRelationship') {
    throw new Error('Opportunity relationship section contract is missing.');
  }

  if (!model.relationships.accountRequired) {
    throw new Error('Account relationship must be required.');
  }

  if (!Array.isArray(model.serviceToggle.options) || model.serviceToggle.options.length !== 4) {
    throw new Error('Service toggle options are invalid.');
  }

  if (!Array.isArray(model.workflow.stages) || model.workflow.stages.length === 0) {
    throw new Error('Workflow stages are invalid.');
  }

  if (!Array.isArray(model.quotes.brandingProfiles) || model.quotes.brandingProfiles.length !== 3) {
    throw new Error('Quote branding profiles are invalid.');
  }

  if (!Array.isArray(model.requiredSections) || model.requiredSections.length === 0) {
    throw new Error('Required UI sections are missing.');
  }

  return {
    ok: true,
    headerSectionId: headerSection.sectionId,
    headerSummaryId: headerSummary.summaryId,
    relationshipSectionId: relationshipSection.sectionId,
    serviceToggleCount: model.serviceToggle.options.length,
    workflowStageCount: model.workflow.stages.length,
    quoteBrandingProfileCount: model.quotes.brandingProfiles.length,
    requiredSectionCount: model.requiredSections.length
  };
}
