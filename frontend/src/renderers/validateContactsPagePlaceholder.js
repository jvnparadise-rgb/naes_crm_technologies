import { renderContactsPagePlaceholder } from './renderContactsPagePlaceholder.js';

export function validateContactsPagePlaceholder() {
  const view = renderContactsPagePlaceholder();

  if (view.type !== 'ContactsPagePlaceholder') {
    throw new Error('Contacts placeholder renderer did not initialize.');
  }

  if (!Array.isArray(view.sections) || view.sections.length === 0) {
    throw new Error('Contacts placeholder sections are missing.');
  }

  if (!view.supportsPrimaryOpportunityContact) {
    throw new Error('Contacts placeholder must support primary opportunity contact.');
  }

  if (!view.supportsAdditionalOpportunityContacts) {
    throw new Error('Contacts placeholder must support additional opportunity contacts.');
  }

  return {
    ok: true,
    pageTitle: view.pageTitle,
    sectionCount: view.sections.length,
    coreFieldCount: view.coreFieldCount
  };
}
