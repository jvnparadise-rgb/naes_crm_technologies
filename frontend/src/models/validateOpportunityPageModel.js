import { createOpportunityPageModel } from './OpportunityPageModel.js';

export function validateOpportunityPageModel() {
  const model = createOpportunityPageModel();

  if (model.type !== 'OpportunityPageModel') {
    throw new Error('Opportunity page model did not initialize.');
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
    serviceToggleCount: model.serviceToggle.options.length,
    workflowStageCount: model.workflow.stages.length,
    quoteBrandingProfileCount: model.quotes.brandingProfiles.length,
    requiredSectionCount: model.requiredSections.length
  };
}
