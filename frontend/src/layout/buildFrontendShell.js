import { createAppShellModel } from './AppShellModel.js';
import { createPlaceholderPage } from '../pages/PlaceholderPage.js';
import { loadNavigationContract } from '../contracts/navigationContract.js';
import { loadPageContract } from '../contracts/pageContract.js';
import { renderOpportunityPagePlaceholder, renderAccountsPagePlaceholder, renderContactsPagePlaceholder } from '../renderers/index.js';

export function buildFrontendShell(activePageId = 'opportunities') {
  const navigationItems = loadNavigationContract();
  const pages = loadPageContract();

  let pageOutlet = null;

  if (activePageId === 'opportunities') {
    pageOutlet = renderOpportunityPagePlaceholder();
  } else if (activePageId === 'accounts') {
    pageOutlet = renderAccountsPagePlaceholder();
  } else if (activePageId === 'contacts') {
    pageOutlet = renderContactsPagePlaceholder();
  } else {
    const fallbackPage =
      pages.topLevelPages.find(page => page.id === activePageId) ||
      pages.topLevelPages[0];

    pageOutlet = createPlaceholderPage({
      id: fallbackPage.id,
      label: fallbackPage.label,
      path: fallbackPage.path
    });
  }

  return createAppShellModel({
    navigationItems,
    pageOutlet
  });
}
