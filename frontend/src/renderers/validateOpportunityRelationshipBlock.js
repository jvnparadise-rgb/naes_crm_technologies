import { renderOpportunityRelationshipBlock } from './renderOpportunityRelationshipBlock.js';

export function validateOpportunityRelationshipBlock() {
  const view = renderOpportunityRelationshipBlock();

  if (view.type !== 'OpportunityRelationshipBlock') {
    throw new Error('Opportunity relationship block did not initialize.');
  }

  if (view.sectionId !== 'accountRelationship') {
    throw new Error('Opportunity relationship block section id is invalid.');
  }

  if (view.summaryId !== 'opportunityRelationshipSummary') {
    throw new Error('Opportunity relationship block summary id is invalid.');
  }

  if (!Array.isArray(view.slots) || view.slots.length !== 3) {
    throw new Error('Opportunity relationship block slots are invalid.');
  }

  if (!view.requirements.accountRequired) {
    throw new Error('Opportunity relationship block must require an account.');
  }

  if (!Array.isArray(view.actions) || view.actions.length < 3) {
    throw new Error('Opportunity relationship block actions are invalid.');
  }

  return {
    ok: true,
    type: view.type,
    title: view.title,
    sectionId: view.sectionId,
    summaryId: view.summaryId,
    slotCount: view.slots.length,
    actionCount: view.actions.length
  };
}
