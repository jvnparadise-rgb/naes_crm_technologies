import { accountEntryUiContract } from './accountEntryUiContract.js';
import { opportunityAccountLinkUiContract } from './opportunityAccountLinkUiContract.js';

export function validateAccountLinkContracts() {
  if (!accountEntryUiContract.requiredActions.includes('createAccount')) {
    throw new Error('Accounts UI must support createAccount.');
  }

  if (!opportunityAccountLinkUiContract.relationshipArea.inlineAccountCreateSupported) {
    throw new Error('Opportunities UI must support inline account creation.');
  }

  if (!opportunityAccountLinkUiContract.relationshipArea.immediateAssociationRequired) {
    throw new Error('Opportunities UI must immediately associate created accounts.');
  }

  return {
    ok: true,
    accountsActionCount: accountEntryUiContract.requiredActions.length,
    opportunityActionCount: opportunityAccountLinkUiContract.requiredActions.length
  };
}
