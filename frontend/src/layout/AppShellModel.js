import { tokens } from '../theme/tokens.js';
import { createSidebarShell } from '../components/sidebar/SidebarShell.js';
import { createHeaderShell } from '../components/header/HeaderShell.js';

export function createAppShellModel({ navigationItems = [], pageOutlet = null } = {}) {
  return {
    type: 'AppShellModel',
    tokens,
    header: createHeaderShell(),
    sidebar: createSidebarShell(navigationItems),
    pageOutlet
  };
}
