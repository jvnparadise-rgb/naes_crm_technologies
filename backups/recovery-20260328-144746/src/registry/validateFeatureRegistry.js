import { featureRegistry } from './featureRegistry.js';

export function validateFeatureRegistry() {
  const ids = new Set();
  const paths = new Set();

  for (const item of featureRegistry) {
    if (!item.id || !item.label || !item.path || !item.type) {
      throw new Error(`Feature item missing required fields: ${JSON.stringify(item)}`);
    }

    if (ids.has(item.id)) {
      throw new Error(`Duplicate feature id: ${item.id}`);
    }

    if (paths.has(item.path)) {
      throw new Error(`Duplicate feature path: ${item.path}`);
    }

    ids.add(item.id);
    paths.add(item.path);
  }

  for (const item of featureRegistry) {
    if (item.parentId && !ids.has(item.parentId)) {
      throw new Error(`Missing parentId reference for feature ${item.id}: ${item.parentId}`);
    }
  }

  return {
    ok: true,
    itemCount: featureRegistry.length,
    sidebarItemCount: featureRegistry.filter(item => item.sidebar).length,
    pricingContextCount: featureRegistry.filter(item => item.pricingContext).length
  };
}
