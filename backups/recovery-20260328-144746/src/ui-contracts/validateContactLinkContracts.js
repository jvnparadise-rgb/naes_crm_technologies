import { contactEntryUiContract } from './contactEntryUiContract.js';
import { opportunityContactLinkUiContract } from './opportunityContactLinkUiContract.js';

export function validateContactLinkContracts() {
  if (!contactEntryUiContract.requiredActions.includes('createContact')) {
    throw new Error('Contacts UI must support createContact.');
  }

  if (!opportunityContactLinkUiContract.relationshipArea.inlineContactCreateSupported) {
    throw new Error('Opportunities UI must support inline contact creation.');
  }

  if (!opportunityContactLinkUiContract.relationshipArea.immediateAssociationRequired) {
    throw new Error('Opportunities UI must immediately associate created contacts.');
  }

  return {
    ok: true,
    contactsActionCount: contactEntryUiContract.requiredActions.length,
    opportunityContactActionCount: opportunityContactLinkUiContract.requiredActions.length
  };
}
