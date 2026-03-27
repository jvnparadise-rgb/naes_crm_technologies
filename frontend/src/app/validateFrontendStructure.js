import { tokens } from '../theme/tokens.js';
import { createHeaderShell } from '../components/header/HeaderShell.js';
import { buildFrontendShell } from '../layout/buildFrontendShell.js';
import { loadNavigationContract } from '../contracts/navigationContract.js';
import { loadPageContract } from '../contracts/pageContract.js';

export function validateFrontendStructure() {
  const navigation = loadNavigationContract();
  const pages = loadPageContract();

  const opportunitiesShell = buildFrontendShell('opportunities');
  const accountsShell = buildFrontendShell('accounts');
  const contactsShell = buildFrontendShell('contacts');

  if (!tokens.color.primary || !tokens.color.secondary) {
    throw new Error('Theme tokens are incomplete.');
  }

  if (!Array.isArray(navigation) || navigation.length === 0) {
    throw new Error('Navigation contract is empty.');
  }

  if (!pages.topLevelPages.length) {
    throw new Error('Page contract is empty.');
  }

  if (opportunitiesShell.type !== 'AppShellModel') {
    throw new Error('Opportunity shell did not initialize.');
  }

  if (opportunitiesShell.pageOutlet.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder was not loaded into the shell.');
  }

  if (accountsShell.pageOutlet.type !== 'AccountsPagePlaceholder') {
    throw new Error('Accounts placeholder was not loaded into the shell.');
  }

  if (contactsShell.pageOutlet.type !== 'ContactsPagePlaceholder') {
    throw new Error('Contacts placeholder was not loaded into the shell.');
  }

  return {
    ok: true,
    sidebarItemCount: opportunitiesShell.sidebar.itemCount,
    headerTitle: createHeaderShell().title,
    activePageTypes: [
      opportunitiesShell.pageOutlet.type,
      accountsShell.pageOutlet.type,
      contactsShell.pageOutlet.type
    ],
    primaryColor: tokens.color.primary
  };
}
