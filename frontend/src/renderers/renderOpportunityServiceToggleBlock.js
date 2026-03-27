import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

function normalizeToggleOption(option) {
  if (typeof option === 'object' && option !== null) return option;

  const label = String(option ?? '').trim();

  const keyMap = {
    'Renewables': 'renewables',
    'StratoSight': 'stratosight',
    'Both': 'both',
    'Other O&M': 'otherOM'
  };

  return {
    key: keyMap[label] ?? label,
    label,
    required: true
  };
}

export function renderOpportunityServiceToggleBlock() {
  const model = createOpportunityPageModel();

  const options = Array.isArray(model.serviceToggle?.options)
    ? model.serviceToggle.options.map(normalizeToggleOption)
    : [];

  const summaryOptions = Array.isArray(model.serviceToggleSummary?.options)
    ? model.serviceToggleSummary.options
    : [];

  const optionKeys = options.map((option) => option?.key).filter(Boolean);

  return {
    type: 'OpportunityServiceToggleBlock',
    title: 'Service Line',
    sectionId: 'serviceLineSelection',
    summaryId: model.serviceToggleSummary?.summaryId ?? 'opportunityServiceToggleSummary',
    options,
    summaryOptions,
    selectionRules: {
      singleSelect: true,
      supportsBoth: optionKeys.includes('both'),
      supportsOtherOm: optionKeys.includes('otherOM')
    }
  };
}
