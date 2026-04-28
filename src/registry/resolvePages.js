import { pageRegistry } from './pageRegistry.js';

export function getPageById(id) {
  return pageRegistry.find(page => page.id === id) || null;
}

export function getPageByPath(path) {
  return pageRegistry.find(page => page.path === path) || null;
}

export function listTopLevelPages() {
  return pageRegistry.filter(page => page.parentId === null);
}

export function listChildPages(parentId) {
  return pageRegistry.filter(page => page.parentId === parentId);
}
