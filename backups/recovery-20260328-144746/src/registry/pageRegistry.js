import { featureRegistry } from './featureRegistry.js';

export const pageRegistry = featureRegistry.map((item) => ({
  id: item.id,
  label: item.label,
  path: item.path,
  parentId: item.parentId,
  sidebar: item.sidebar,
  pricingContext: item.pricingContext,
  pageModuleKey: `${item.id}-page`,
  layout: item.parentId ? 'nested' : 'standard',
  status: 'planned'
}));
