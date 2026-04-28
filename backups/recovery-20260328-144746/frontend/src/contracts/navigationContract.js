import { buildNavigationTree } from '../../../src/navigation/index.js';

export function loadNavigationContract() {
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
