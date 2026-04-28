import { themeTokens } from './themeTokens.js';
import { buildSidebarModel } from './sidebarModel.js';
import { buildPageShellModel } from './pageShellModel.js';

export function validateFrontendShell() {
  const sidebar = buildSidebarModel();
  const pageShell = buildPageShellModel();

  if (!themeTokens?.color?.primary || !themeTokens?.color?.secondary) {
    throw new Error('Theme tokens are incomplete.');
  }

  if (!Array.isArray(sidebar) || sidebar.length === 0) {
    throw new Error('Sidebar model is empty.');
  }

  if (!pageShell?.topLevelPages?.length) {
    throw new Error('Page shell model is empty.');
  }

  return {
    ok: true,
    sidebarItemCount: sidebar.length,
    welcomeChildren: pageShell.nestedGroups.welcome.length,
    accountsChildren: pageShell.nestedGroups.accounts.length,
    primaryColor: themeTokens.color.primary,
    secondaryColor: themeTokens.color.secondary
  };
}
