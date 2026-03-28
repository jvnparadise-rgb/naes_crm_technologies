import { buildNavigationTree } from '../navigation/index.js';

export function buildSidebarModel() {
  return buildNavigationTree().map(item => ({
    id: item.id,
    label: item.label,
    path: item.path,
    children: (item.children || []).map(child => ({
      id: child.id,
      label: child.label,
      path: child.path
    }))
  }));
}
