import { renderOpportunityServiceToggleBlock } from './renderOpportunityServiceToggleBlock.js';

export function validateOpportunityServiceToggleBlock() {
  const block = renderOpportunityServiceToggleBlock();

  if (block.type !== 'OpportunityServiceToggleBlock') {
    throw new Error('Opportunity service toggle block did not initialize.');
  }

  if (!Array.isArray(block.options) || block.options.length !== 4) {
    throw new Error('Opportunity service toggle options are invalid.');
  }

  const requiredOptions = ['Renewables', 'StratoSight', 'Both', 'Other O&M'];
  for (const option of requiredOptions) {
    if (!block.options.includes(option)) {
      throw new Error(`Missing service toggle option: ${option}`);
    }
  }

  return {
    ok: true,
    optionCount: block.optionCount,
    supportedToggleCount: block.pricingSummary.supportedToggles.length
  };
}
