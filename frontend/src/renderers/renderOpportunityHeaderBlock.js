import { createOpportunityPageModel } from '../models/OpportunityPageModel.js';

export function renderOpportunityHeaderBlock() {
  const model = createOpportunityPageModel();

  return {
    type: 'OpportunityHeaderBlock',
    title: model.header.title,
    entity: model.header.entity,
    sectionId: model.headerSection.sectionId,
    summaryId: model.headerSummary.summaryId,
    fields: model.headerSummary.fields,
    badges: [
      {
        key: 'entity',
        label: 'Entity',
        value: model.header.entity
      },
      {
        key: 'quotes',
        label: 'Quote Profiles',
        value: String(model.quotes.brandingProfiles.length)
      },
      {
        key: 'audit',
        label: 'Audit Required',
        value: model.audit.required ? 'Yes' : 'No'
      }
    ],
    actions: [
      {
        key: 'createQuote',
        label: 'Create Quote',
        status: 'enabled'
      },
      {
        key: 'viewAudit',
        label: 'View Audit Trail',
        status: model.audit.required ? 'enabled' : 'hidden'
      }
    ]
  };
}
