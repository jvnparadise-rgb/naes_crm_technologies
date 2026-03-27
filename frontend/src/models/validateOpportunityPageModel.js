import { createOpportunityPageModel } from './OpportunityPageModel.js';
import { validateOpportunityHeaderSectionModel } from './validateOpportunityHeaderSectionModel.js';
import { validateOpportunityHeaderSummaryModel } from './validateOpportunityHeaderSummaryModel.js';
import { validateOpportunityRelationshipSectionModel } from './validateOpportunityRelationshipSectionModel.js';
import { validateOpportunityRelationshipSummaryModel } from './validateOpportunityRelationshipSummaryModel.js';
import { validateOpportunityServiceToggleSummaryModel } from './validateOpportunityServiceToggleSummaryModel.js';
import { validateOpportunityWorkflowSummaryModel } from './validateOpportunityWorkflowSummaryModel.js';

export function validateOpportunityPageModel() {
  const model = createOpportunityPageModel();
  const headerSection = validateOpportunityHeaderSectionModel();
  const headerSummary = validateOpportunityHeaderSummaryModel();
  const relationshipSection = validateOpportunityRelationshipSectionModel();
  const relationshipSummary = validateOpportunityRelationshipSummaryModel();
  const serviceToggleSummary = validateOpportunityServiceToggleSummaryModel();
  const workflowSummary = validateOpportunityWorkflowSummaryModel();

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

  if (!model.relationshipSummary || model.relationshipSummary.summaryId !== 'opportunityRelationshipSummary') {
    throw new Error('Opportunity relationship summary contract is missing.');
  }

  if (!model.serviceToggleSummary || model.serviceToggleSummary.summaryId !== 'opportunityServiceToggleSummary') {
    throw new Error('Opportunity service toggle summary contract is missing.');
  }

  if (!model.workflowSummary || model.workflowSummary.summaryId !== 'opportunityWorkflowSummary') {
    throw new Error('Opportunity workflow summary contract is missing.');
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
    relationshipSummaryId: relationshipSummary.summaryId,
    serviceToggleSummaryId: serviceToggleSummary.summaryId,
    workflowSummaryId: workflowSummary.summaryId,
    serviceToggleCount: model.serviceToggle.options.length,
    workflowStageCount: model.workflow.stages.length,
    quoteBrandingProfileCount: model.quotes.brandingProfiles.length,
    requiredSectionCount: model.requiredSections.length
  };
}
