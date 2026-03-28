import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityServiceToggleBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityServiceToggleBlock',
    options: model.serviceToggle.options,
    optionCount: model.serviceToggle.options.length,
    pricingSummary: {
      supportedToggles: model.pricingArea.supportedToggles,
      includesRenewables: !!model.pricingArea.renewables,
      includesStratosight: !!model.pricingArea.stratosight,
      includesOtherOM: !!model.pricingArea.otherOM,
      includesBoth: !!model.pricingArea.both
    }
  };
}
