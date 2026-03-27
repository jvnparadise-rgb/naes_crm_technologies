import { renderOpportunityServiceToggleBlock } from './renderOpportunityServiceToggleBlock.js';

export function validateOpportunityServiceToggleBlock() {
  const view = renderOpportunityServiceToggleBlock();

  if (view.type !== 'OpportunityServiceToggleBlock') {
    throw new Error('Opportunity service toggle block did not initialize.');
  }

  if (view.sectionId !== 'serviceLineSelection') {
    throw new Error('Opportunity service toggle block section id is invalid.');
  }

  if (view.summaryId !== 'opportunityServiceToggleSummary') {
    throw new Error('Opportunity service toggle block summary id is invalid.');
  }

  if (!Array.isArray(view.options) || view.options.length !== 4) {
    throw new Error('Opportunity service toggle options are invalid.');
  }

  if (!Array.isArray(view.summaryOptions) || view.summaryOptions.length !== 4) {
    throw new Error('Opportunity service toggle summary options are invalid.');
  }

  const optionKeys = view.options.map((option) => option?.key);
  const summaryKeys = view.summaryOptions.map((option) => option?.key);

  for (const requiredKey of ['renewables', 'stratosight', 'both', 'otherOM']) {
    if (!optionKeys.includes(requiredKey)) {
      throw new Error(`Missing opportunity service toggle option: ${requiredKey}`);
    }
    if (!summaryKeys.includes(requiredKey)) {
      throw new Error(`Missing opportunity service toggle summary option: ${requiredKey}`);
    }
  }

  if (!view.selectionRules.singleSelect) {
    throw new Error('Opportunity service toggle must remain single select.');
  }

  if (!view.selectionRules.supportsBoth) {
    throw new Error('Opportunity service toggle must support Both.');
  }

  if (!view.selectionRules.supportsOtherOm) {
    throw new Error('Opportunity service toggle must support Other O&M.');
  }

  return {
    ok: true,
    type: view.type,
    title: view.title,
    sectionId: view.sectionId,
    summaryId: view.summaryId,
    optionCount: view.options.length,
    summaryOptionCount: view.summaryOptions.length
  };
}
