import { renderOpportunityHeaderBlock } from './renderOpportunityHeaderBlock.js';

export function validateOpportunityHeaderBlock() {
  const view = renderOpportunityHeaderBlock();

  if (view.type !== 'OpportunityHeaderBlock') {
    throw new Error('Opportunity header block did not initialize.');
  }

  if (view.sectionId !== 'opportunityHeader') {
    throw new Error('Opportunity header block section id is invalid.');
  }

  if (view.summaryId !== 'opportunityHeaderSummary') {
    throw new Error('Opportunity header block summary id is invalid.');
  }

  if (!Array.isArray(view.fields) || view.fields.length !== 5) {
    throw new Error('Opportunity header block fields are invalid.');
  }

  if (!Array.isArray(view.badges) || view.badges.length < 3) {
    throw new Error('Opportunity header block badges are invalid.');
  }

  if (!Array.isArray(view.actions) || view.actions.length < 2) {
    throw new Error('Opportunity header block actions are invalid.');
  }

  return {
    ok: true,
    type: view.type,
    title: view.title,
    sectionId: view.sectionId,
    summaryId: view.summaryId,
    fieldCount: view.fields.length,
    badgeCount: view.badges.length,
    actionCount: view.actions.length
  };
}
