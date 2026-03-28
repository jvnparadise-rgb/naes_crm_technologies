import { buildNavigationTree, getFeatureById, getFeatureByPath } from './resolveNavigation.js';

export function validateNavigationResolver() {
  const tree = buildNavigationTree();

  if (!Array.isArray(tree) || tree.length === 0) {
    throw new Error('Navigation tree is empty.');
  }

  const accounts = getFeatureById('accounts');
  const opportunities = getFeatureByPath('/opportunities');

  if (!accounts) {
    throw new Error('Accounts feature lookup failed.');
  }

  if (!opportunities) {
    throw new Error('Path lookup for /opportunities failed.');
  }

  return {
    ok: true,
    topLevelCount: tree.length,
    accountsChildren: tree.find(item => item.id === 'accounts')?.children?.length || 0,
    welcomeChildren: tree.find(item => item.id === 'welcome')?.children?.length || 0
  };
}
