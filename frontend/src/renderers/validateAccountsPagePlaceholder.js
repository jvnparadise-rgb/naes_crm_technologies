import { renderAccountsPagePlaceholder } from './renderAccountsPagePlaceholder.js';

export function validateAccountsPagePlaceholder() {
  const view = renderAccountsPagePlaceholder();

  if (view.type !== 'AccountsPagePlaceholder') {
    throw new Error('Accounts placeholder renderer did not initialize.');
  }

  if (!Array.isArray(view.sections) || view.sections.length === 0) {
    throw new Error('Accounts placeholder sections are missing.');
  }

  if (!view.linkedToOpportunityHub) {
    throw new Error('Accounts placeholder must remain linked to the Opportunity hub.');
  }

  return {
    ok: true,
    pageTitle: view.pageTitle,
    sectionCount: view.sections.length,
    coreFieldCount: view.coreFieldCount
  };
}
