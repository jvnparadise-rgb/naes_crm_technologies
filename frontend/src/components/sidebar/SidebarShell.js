export function createSidebarShell(navigationItems = []) {
  return {
    type: 'SidebarShell',
    itemCount: navigationItems.length,
    items: navigationItems
  };
}
