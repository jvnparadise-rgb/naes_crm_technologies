export function createPlaceholderPage({ id, label, path }) {
  return {
    type: 'PlaceholderPage',
    id,
    label,
    path,
    status: 'placeholder'
  };
}
