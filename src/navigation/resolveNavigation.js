import { featureRegistry } from '../registry/featureRegistry.js';

function byId(id) {
  return featureRegistry.find(item => item.id === id) || null;
}

function topLevelItems() {
  return featureRegistry.filter(item => item.sidebar && item.parentId === null);
}

function childItems(parentId) {
  return featureRegistry.filter(item => item.sidebar && item.parentId === parentId);
}

export function buildNavigationTree() {
  return topLevelItems().map(item => ({
    ...item,
    children: childItems(item.id)
  }));
}

export function getFeatureById(id) {
  return byId(id);
}

export function getFeatureByPath(path) {
  return featureRegistry.find(item => item.path === path) || null;
}
