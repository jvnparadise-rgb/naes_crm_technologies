import { renderOpportunityRelationshipBlock } from './renderOpportunityRelationshipBlock.js';

export function validateOpportunityRelationshipBlock() {
  const block = renderOpportunityRelationshipBlock();

  if (block.type !== 'OpportunityRelationshipBlock') {
    throw new Error('Opportunity relationship block did not initialize.');
  }

  if (!block.accountRequired) {
    throw new Error('Account relationship must remain required.');
  }

  if (!block.inlineAccountCreateSupported) {
    throw new Error('Inline account creation must be supported.');
  }

  if (!block.inlineContactCreateSupported) {
    throw new Error('Inline contact creation must be supported.');
  }

  if (!Array.isArray(block.relationshipBlocks) || block.relationshipBlocks.length !== 3) {
    throw new Error('Relationship blocks are incomplete.');
  }

  return {
    ok: true,
    relationshipBlockCount: block.relationshipBlocks.length,
    accountActionCount: block.accountLinkActions.length,
    contactActionCount: block.contactLinkActions.length
  };
}
