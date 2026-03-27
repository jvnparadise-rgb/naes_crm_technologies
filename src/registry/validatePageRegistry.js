import { pageRegistry } from './pageRegistry.js';
import { getPageById, getPageByPath, listTopLevelPages, listChildPages } from './resolvePages.js';

export function validatePageRegistry() {
  if (!Array.isArray(pageRegistry) || pageRegistry.length === 0) {
    throw new Error('Page registry is empty.');
  }

  const ids = new Set();
  const paths = new Set();

  for (const page of pageRegistry) {
    if (!page.id || !page.label || !page.path || !page.pageModuleKey) {
      throw new Error(`Page entry missing required fields: ${JSON.stringify(page)}`);
    }

    if (ids.has(page.id)) {
      throw new Error(`Duplicate page id: ${page.id}`);
    }

    if (paths.has(page.path)) {
      throw new Error(`Duplicate page path: ${page.path}`);
    }

    ids.add(page.id);
    paths.add(page.path);
  }

  if (!getPageById('accounts')) {
    throw new Error('Accounts page lookup failed.');
  }

  if (!getPageByPath('/opportunities')) {
    throw new Error('Opportunities path lookup failed.');
  }

  return {
    ok: true,
    pageCount: pageRegistry.length,
    topLevelPageCount: listTopLevelPages().length,
    accountsChildCount: listChildPages('accounts').length,
    welcomeChildCount: listChildPages('welcome').length
  };
}
