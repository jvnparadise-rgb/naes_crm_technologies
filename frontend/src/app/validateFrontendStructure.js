import { tokens } from '../theme/tokens.js';
import { createSidebarShell } from '../components/sidebar/SidebarShell.js';
import { createHeaderShell } from '../components/header/HeaderShell.js';
import { createAppShellModel } from '../layout/AppShellModel.js';
import { createPlaceholderPage } from '../pages/PlaceholderPage.js';

export function validateFrontendStructure() {
  const samplePage = createPlaceholderPage({
    id: 'welcome',
    label: 'Welcome',
    path: '/welcome'
  });

  const sidebar = createSidebarShell([
    { id: 'welcome', label: 'Welcome', path: '/welcome', children: [] }
  ]);

  const appShell = createAppShellModel({
    navigationItems: sidebar.items,
    pageOutlet: samplePage
  });

  if (!tokens.color.primary || !tokens.color.secondary) {
    throw new Error('Theme tokens are incomplete.');
  }

  if (sidebar.itemCount < 1) {
    throw new Error('Sidebar shell did not initialize.');
  }

  if (appShell.type !== 'AppShellModel') {
    throw new Error('App shell model did not initialize.');
  }

  return {
    ok: true,
    sidebarItemCount: sidebar.itemCount,
    headerTitle: createHeaderShell().title,
    placeholderPageId: samplePage.id,
    primaryColor: tokens.color.primary
  };
}
