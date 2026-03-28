import { pageStatusRegistry } from './pageStatusRegistry.js';
import { pageRegistry } from '../registry/pageRegistry.js';

export function validatePageStatusRegistry() {
  for (const page of pageRegistry) {
    if (!pageStatusRegistry[page.id]) {
      throw new Error(`Missing page status for: ${page.id}`);
    }
  }

  return {
    ok: true,
    pageStatusCount: Object.keys(pageStatusRegistry).length,
    priorityFirstPages: Object.entries(pageStatusRegistry)
      .filter(([, value]) => value === 'priority-first')
      .map(([key]) => key)
  };
}
