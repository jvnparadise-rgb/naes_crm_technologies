import { tokens } from '../theme/tokens.js';
import { createHeaderShell } from '../components/header/HeaderShell.js';
import { buildFrontendShell } from '../layout/buildFrontendShell.js';
import { loadNavigationContract } from '../contracts/navigationContract.js';
import { loadPageContract } from '../contracts/pageContract.js';

export function validateFrontendStructure() {
  const navigation = loadNavigationContract();
  const pages = loadPageContract();
  const appShell = buildFrontendShell('opportunities');

  if (!tokens.color.primary || !tokens.color.secondary) {
    throw new Error('Theme tokens are incomplete.');
  }

  if (!Array.isArray(navigation) || navigation.length === 0) {
    throw new Error('Navigation contract is empty.');
  }

  if (!pages.topLevelPages.length) {
    throw new Error('Page contract is empty.');
  }

  if (appShell.type !== 'AppShellModel') {
    throw new Error('App shell model did not initialize.');
  }

  if (appShell.pageOutlet.type !== 'OpportunityPagePlaceholder') {
    throw new Error('Opportunity placeholder was not loaded into the shell.');
  }

  return {
    ok: true,
    sidebarItemCount: appShell.sidebar.itemCount,
    headerTitle: createHeaderShell().title,
    activePageType: appShell.pageOutlet.type,
    primaryColor: tokens.color.primary
  };
}
